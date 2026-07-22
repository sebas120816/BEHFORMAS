using System.Text.Json;
using Grand.Business.Core.Interfaces.Catalog.Brands;
using Grand.Business.Core.Interfaces.Catalog.Categories;
using Grand.Business.Core.Interfaces.Catalog.Collections;
using Grand.Business.Core.Interfaces.Catalog.Products;
using Grand.Business.Core.Interfaces.Common.Seo;
using Grand.Business.Core.Interfaces.Storage;
using Grand.Domain.Catalog;
using Grand.Domain.Common;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Grand.Web.Plugins.Theme.BehOffice.Controllers;

public class BehCatalogImportController : Controller
{
    private readonly ICategoryService _categoryService;
    private readonly ICategoryLayoutService _categoryLayoutService;
    private readonly IProductService _productService;
    private readonly IProductCategoryService _productCategoryService;
    private readonly IProductLayoutService _productLayoutService;
    private readonly IPictureService _pictureService;
    private readonly ISeNameService _seNameService;
    private readonly IBrandService _brandService;
    private readonly ICollectionService _collectionService;
    private readonly IWebHostEnvironment _env;

    public BehCatalogImportController(
        ICategoryService categoryService,
        ICategoryLayoutService categoryLayoutService,
        IProductService productService,
        IProductCategoryService productCategoryService,
        IProductLayoutService productLayoutService,
        IPictureService pictureService,
        ISeNameService seNameService,
        IBrandService brandService,
        ICollectionService collectionService,
        IWebHostEnvironment env)
    {
        _categoryService = categoryService;
        _categoryLayoutService = categoryLayoutService;
        _productService = productService;
        _productCategoryService = productCategoryService;
        _productLayoutService = productLayoutService;
        _pictureService = pictureService;
        _seNameService = seNameService;
        _brandService = brandService;
        _collectionService = collectionService;
        _env = env;
    }

    private static readonly HashSet<string> BehCategoryNames = new(StringComparer.OrdinalIgnoreCase) {
        "Sillas de oficina", "Sillas interlocutoras", "Escritorios y estaciones",
        "Tándem y salas de espera", "Accesorios para sillas"
    };

    [HttpGet("beh-tools/list-non-beh-taxonomy")]
    public async Task<IActionResult> ListNonBehTaxonomy(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var categories = await _categoryService.GetAllCategories(pageSize: int.MaxValue, showHidden: true);
        var nonBehCategories = categories.Where(c => !BehCategoryNames.Contains(c.Name))
            .Select(c => new { c.Id, c.Name }).ToList();

        var brands = await _brandService.GetAllBrands(pageSize: int.MaxValue, showHidden: true);
        var collections = await _collectionService.GetAllCollections(pageSize: int.MaxValue, showHidden: true);

        return Json(new {
            totalCategories = categories.Count,
            behCategories = categories.Count - nonBehCategories.Count,
            nonBehCategories,
            totalBrands = brands.Count,
            brands = brands.Select(b => new { b.Id, b.Name }),
            totalCollections = collections.Count,
            collections = collections.Select(c => new { c.Id, c.Name })
        });
    }

    [HttpGet("beh-tools/delete-non-beh-taxonomy")]
    public async Task<IActionResult> DeleteNonBehTaxonomy(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var sampleCategoryNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase) {
            "Computers", "Tablets", "Notebooks", "Smartwatches", "Electronics", "Display",
            "Smartphones", "Others", "Sport", "Shoes", "Apparel", "Balls",
            "Digital downloads", "Lego", "Gift vouchers"
        };

        var categories = await _categoryService.GetAllCategories(pageSize: int.MaxValue, showHidden: true);
        var deletedCategories = new List<string>();
        var errors = new List<string>();
        foreach (var c in categories.Where(c => sampleCategoryNames.Contains(c.Name)))
        {
            try { await _categoryService.DeleteCategory(c); deletedCategories.Add(c.Name); }
            catch (Exception ex) { errors.Add($"category {c.Name}: {ex.Message}"); }
        }

        var brands = await _brandService.GetAllBrands(pageSize: int.MaxValue, showHidden: true);
        var deletedBrands = new List<string>();
        foreach (var b in brands)
        {
            try { await _brandService.DeleteBrand(b); deletedBrands.Add(b.Name); }
            catch (Exception ex) { errors.Add($"brand {b.Name}: {ex.Message}"); }
        }

        var collections = await _collectionService.GetAllCollections(pageSize: int.MaxValue, showHidden: true);
        var deletedCollections = new List<string>();
        foreach (var c in collections)
        {
            try { await _collectionService.DeleteCollection(c); deletedCollections.Add(c.Name); }
            catch (Exception ex) { errors.Add($"collection {c.Name}: {ex.Message}"); }
        }

        return Json(new { deletedCategories, deletedBrands, deletedCollections, errors });
    }

    private class CatalogProduct
    {
        public string Sku { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public double PriceBeforeTax { get; set; }
        public double Price { get; set; }
        public double Price30DaysBeforeTax { get; set; }
        public double Price30Days { get; set; }
        public string Warranty { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
    }

    private class CatalogFile
    {
        public List<CatalogProduct> Products { get; set; }
    }

    [HttpGet("beh-tools/import-catalog")]
    public async Task<IActionResult> RunImport(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var contentRoot = _env.ContentRootPath;
        var importRoot = Path.GetFullPath(Path.Combine(contentRoot, "..", "..", "..", "catalog-import"));
        var catalogPath = Path.Combine(importRoot, "catalog.json");
        if (!System.IO.File.Exists(catalogPath))
            return Content($"No se encontro catalog.json en {catalogPath}");

        var json = await System.IO.File.ReadAllTextAsync(catalogPath);
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var catalog = JsonSerializer.Deserialize<CatalogFile>(json, options);
        if (catalog?.Products == null || catalog.Products.Count == 0)
            return Content("catalog.json no tiene productos");

        var defaultLayout = (await _productLayoutService.GetAllProductLayouts()).FirstOrDefault();
        var defaultCategoryLayout = (await _categoryLayoutService.GetAllCategoryLayouts()).FirstOrDefault();

        var categoryCache = new Dictionary<string, Category>(StringComparer.OrdinalIgnoreCase);
        var createdCategories = new List<string>();
        var createdProducts = new List<string>();
        var updatedProducts = new List<string>();
        var skippedProducts = new List<string>();
        var errors = new List<string>();

        foreach (var categoryName in catalog.Products.Select(p => p.Category).Distinct())
        {
            var existing = (await _categoryService.GetAllCategories(categoryName: categoryName, pageSize: 1))
                .FirstOrDefault(c => string.Equals(c.Name, categoryName, StringComparison.OrdinalIgnoreCase));
            if (existing != null)
            {
                categoryCache[categoryName] = existing;
                continue;
            }

            var category = new Category {
                Name = categoryName,
                Published = true,
                ShowOnHomePage = false,
                IncludeInMenu = true,
                CategoryLayoutId = defaultCategoryLayout?.Id,
                PageSize = 24,
                AllowCustomersToSelectPageSize = true,
                PageSizeOptions = "12,24,48"
            };
            category.SeName = await _seNameService.ValidateSeName(category, "", category.Name, true);
            await _categoryService.InsertCategory(category);
            await _seNameService.SaveSeName(category);
            categoryCache[categoryName] = category;
            createdCategories.Add($"{category.Name} -> /{category.SeName}");
        }

        foreach (var item in catalog.Products)
        {
            try
            {
                if (!categoryCache.TryGetValue(item.Category, out var category))
                {
                    skippedProducts.Add($"{item.Sku}: categoria '{item.Category}' no resuelta");
                    continue;
                }

                var existingProduct = await _productService.GetProductBySku(item.Sku);
                if (existingProduct != null)
                {
                    updatedProducts.Add($"{item.Sku} {item.Name} (ya existia, se omite)");
                    continue;
                }

                var product = new Product {
                    ProductTypeId = ProductType.SimpleProduct,
                    VisibleIndividually = true,
                    Published = true,
                    Name = item.Name,
                    ShortDescription = item.Description,
                    FullDescription = BuildFullDescription(item),
                    Sku = item.Sku,
                    AllowCustomerReviews = false,
                    ManageInventoryMethodId = ManageInventoryMethod.DontManageStock,
                    StockAvailability = true,
                    IsShipEnabled = true,
                    IsTaxExempt = true,
                    OrderMinimumQuantity = 1,
                    OrderMaximumQuantity = 50,
                    Price = item.Price,
                    OldPrice = item.Price30Days > item.Price ? item.Price30Days : 0,
                    CatalogPrice = item.Price,
                    ProductLayoutId = defaultLayout?.Id
                };

                product.SeName = await _seNameService.ValidateSeName(product, "", product.Name, true);
                await _productService.InsertProduct(product);
                await _seNameService.SaveSeName(product);

                await _productCategoryService.InsertProductCategory(new ProductCategory {
                    CategoryId = category.Id,
                    DisplayOrder = 1
                }, product.Id);

                var imagePath = Path.Combine(importRoot, item.Image ?? "");
                if (!string.IsNullOrEmpty(item.Image) && System.IO.File.Exists(imagePath))
                {
                    var mimeType = Path.GetExtension(imagePath).ToLowerInvariant() switch {
                        ".png" => "image/png",
                        ".webp" => "image/webp",
                        _ => "image/jpeg"
                    };
                    var bytes = await System.IO.File.ReadAllBytesAsync(imagePath);
                    var picture = await _pictureService.InsertPicture(bytes, mimeType,
                        _pictureService.GetPictureSeName(product.Name), product.Name, product.Name,
                        true, Reference.Product, product.Id);
                    await _productService.InsertProductPicture(new ProductPicture {
                        PictureId = picture.Id,
                        DisplayOrder = 1,
                        IsDefault = true
                    }, product.Id);
                }

                createdProducts.Add($"{item.Sku} {item.Name} -> /{product.SeName}");
            }
            catch (Exception ex)
            {
                errors.Add($"{item.Sku} {item.Name}: {ex.Message}");
            }
        }

        var summary = new {
            totalInCatalog = catalog.Products.Count,
            categoriesCreated = createdCategories,
            productsCreated = createdProducts.Count,
            productsCreatedDetail = createdProducts,
            productsAlreadyExisting = updatedProducts,
            skipped = skippedProducts,
            errors
        };
        return Json(summary);
    }

    private static string BuildFullDescription(CatalogProduct item)
    {
        var warranty = string.IsNullOrEmpty(item.Warranty) ? "" : $"<p><strong>Garantía:</strong> {item.Warranty}</p>";
        return $"<p>{item.Description}</p>{warranty}";
    }

    [HttpGet("beh-tools/update-images")]
    public async Task<IActionResult> UpdateImages(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var contentRoot = _env.ContentRootPath;
        var importRoot = Path.GetFullPath(Path.Combine(contentRoot, "..", "..", "..", "catalog-import"));
        var mapPath = Path.Combine(importRoot, "image-updates.json");
        if (!System.IO.File.Exists(mapPath))
            return Content($"No se encontro image-updates.json en {mapPath}");

        var json = await System.IO.File.ReadAllTextAsync(mapPath);
        var map = JsonSerializer.Deserialize<Dictionary<string, string>>(json);

        var updated = new List<string>();
        var notFound = new List<string>();
        var errors = new List<string>();

        foreach (var (sku, relativePath) in map!)
        {
            try
            {
                var product = await _productService.GetProductBySku(sku);
                if (product == null)
                {
                    notFound.Add(sku);
                    continue;
                }

                var imagePath = Path.Combine(importRoot, relativePath);
                if (!System.IO.File.Exists(imagePath))
                {
                    errors.Add($"{sku}: archivo no existe {imagePath}");
                    continue;
                }

                foreach (var existingPicture in product.ProductPictures.ToList())
                {
                    var pic = await _pictureService.GetPictureById(existingPicture.PictureId);
                    await _productService.DeleteProductPicture(existingPicture, product.Id);
                    if (pic != null) await _pictureService.DeletePicture(pic);
                }

                var mimeType = Path.GetExtension(imagePath).ToLowerInvariant() switch {
                    ".png" => "image/png",
                    ".webp" => "image/webp",
                    _ => "image/jpeg"
                };
                var bytes = await System.IO.File.ReadAllBytesAsync(imagePath);
                var picture = await _pictureService.InsertPicture(bytes, mimeType,
                    _pictureService.GetPictureSeName(product.Name), product.Name, product.Name,
                    true, Reference.Product, product.Id);
                await _productService.InsertProductPicture(new ProductPicture {
                    PictureId = picture.Id,
                    DisplayOrder = 1,
                    IsDefault = true
                }, product.Id);

                updated.Add($"{sku} {product.Name}");
            }
            catch (Exception ex)
            {
                errors.Add($"{sku}: {ex.Message}");
            }
        }

        return Json(new {
            totalInMap = map.Count,
            updatedCount = updated.Count,
            updated,
            notFound,
            errors
        });
    }

    private async Task<HashSet<string>> LoadBehSkus()
    {
        var contentRoot = _env.ContentRootPath;
        var path = Path.GetFullPath(Path.Combine(contentRoot, "..", "..", "..", "catalog-import", "beh-skus.json"));
        var json = await System.IO.File.ReadAllTextAsync(path);
        var skus = JsonSerializer.Deserialize<List<string>>(json);
        return new HashSet<string>(skus!, StringComparer.OrdinalIgnoreCase);
    }

    [HttpGet("beh-tools/list-non-beh-products")]
    public async Task<IActionResult> ListNonBehProducts(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var behSkus = await LoadBehSkus();
        var (products, _) = await _productService.SearchProducts(pageSize: int.MaxValue, showHidden: true);

        var nonBeh = products
            .Where(p => string.IsNullOrEmpty(p.Sku) || !behSkus.Contains(p.Sku))
            .Select(p => new { p.Id, p.Sku, p.Name })
            .ToList();
        var behCount = products.Count - nonBeh.Count;

        return Json(new { totalProducts = products.Count, behProductsFound = behCount, nonBehCount = nonBeh.Count, nonBeh });
    }

    [HttpGet("beh-tools/delete-non-beh-products")]
    public async Task<IActionResult> DeleteNonBehProducts(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var behSkus = await LoadBehSkus();
        var (products, _) = await _productService.SearchProducts(pageSize: int.MaxValue, showHidden: true);

        var toDelete = products.Where(p => string.IsNullOrEmpty(p.Sku) || !behSkus.Contains(p.Sku)).ToList();
        var deleted = new List<string>();
        var errors = new List<string>();
        foreach (var p in toDelete)
        {
            try
            {
                await _productService.DeleteProduct(p);
                deleted.Add($"{p.Sku} {p.Name}");
            }
            catch (Exception ex)
            {
                errors.Add($"{p.Sku} {p.Name}: {ex.Message}");
            }
        }

        return Json(new { deletedCount = deleted.Count, deleted, errors });
    }
}
