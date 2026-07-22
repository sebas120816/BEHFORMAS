using System.Text.Json;
using System.Text.RegularExpressions;
using Grand.Business.Core.Interfaces.Cms;
using Grand.Business.Core.Interfaces.Common.Directory;
using Grand.Business.Core.Interfaces.Common.Localization;
using Grand.Business.Core.Interfaces.Customers;
using Grand.Business.Core.Utilities.Customers;
using Grand.Domain.Customers;
using Grand.Domain.Localization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Grand.Web.Plugins.Theme.BehOffice.Controllers;

public class BehLocalizationController : Controller
{
    private readonly ILanguageService _languageService;
    private readonly ITranslationService _translationService;
    private readonly IPageService _pageService;
    private readonly ICustomerService _customerService;
    private readonly IGroupService _groupService;
    private readonly ICustomerManagerService _customerManagerService;
    private readonly IWebHostEnvironment _env;

    public BehLocalizationController(
        ILanguageService languageService,
        ITranslationService translationService,
        IPageService pageService,
        ICustomerService customerService,
        IGroupService groupService,
        ICustomerManagerService customerManagerService,
        IWebHostEnvironment env)
    {
        _languageService = languageService;
        _translationService = translationService;
        _pageService = pageService;
        _customerService = customerService;
        _groupService = groupService;
        _customerManagerService = customerManagerService;
        _env = env;
    }

    [HttpGet("beh-tools/reset-admin-password")]
    public async Task<IActionResult> ResetAdminPassword(string token, string email, string newPassword)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(newPassword) || newPassword.Length < 8)
            return BadRequest("email y newPassword (min 8 caracteres) son requeridos");

        var customer = await _customerService.GetCustomerByEmail(email);
        if (customer == null) return NotFound($"No existe el cliente {email}");
        if (!await _groupService.IsAdmin(customer)) return BadRequest($"{email} no pertenece al grupo Administrators");

        await _customerManagerService.ChangePassword(
            new ChangePasswordRequest(email, PasswordFormat.Hashed, newPassword));

        return Json(new { ok = true, email, message = "Contraseña actualizada en la base LOCAL de desarrollo." });
    }

    [HttpGet("beh-tools/list-admins")]
    public async Task<IActionResult> ListAdmins(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var allCustomers = await _customerService.GetAllCustomers(pageSize: 500);
        var admins = new List<object>();
        foreach (var c in allCustomers)
        {
            if (await _groupService.IsAdmin(c))
            {
                admins.Add(new {
                    email = c.Email,
                    username = c.Username,
                    active = c.Active,
                    createdOnUtc = c.CreatedOnUtc,
                    lastLoginUtc = c.LastLoginDateUtc,
                    hasPassword = !string.IsNullOrEmpty(c.Password)
                });
            }
        }
        return Json(new { totalCustomers = allCustomers.Count, adminCount = admins.Count, admins });
    }

    [HttpGet("beh-tools/fix-cms-pages")]
    public async Task<IActionResult> FixCmsPages(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var content = new Dictionary<string, (string Title, string Body)> {
            ["AboutUs"] = ("Sobre BEH",
                "<p>BEH Formas y Arquitecturas fabrica, suministra e instala mobiliario corporativo en Colombia: sillas, escritorios, estaciones de trabajo, salas de espera y carpintería a medida.</p>"),
            ["CheckoutAsGuestOrRegister"] = ("",
                "<p><strong>Regístrate y ahorra tiempo</strong><br />Crear una cuenta te permite:</p><ul><li>Pagar más rápido en tu próxima compra</li><li>Ver el estado y el historial de tus pedidos</li></ul>"),
            ["ConditionsOfUse"] = ("Condiciones de uso",
                "<p>Consulta nuestros <a href=\"/terminos\">términos de compra</a> y nuestro <a href=\"/privacidad\">aviso de privacidad</a>.</p>"),
            ["ContactUs"] = ("",
                "<p>Escríbenos a <a href=\"mailto:gerencia@behformas.com\">gerencia@behformas.com</a> o por WhatsApp al +57 310 320 0976.</p>"),
            ["HomePageText"] = ("Bienvenido a BEH",
                "<p>Mobiliario corporativo fabricado e instalado en Colombia.</p>"),
            ["LoginRegistrationInfo"] = ("Sobre iniciar sesión / registrarte",
                "<p>Inicia sesión o crea una cuenta empresarial para agilizar tus compras y hacer seguimiento a tus pedidos.</p>"),
            ["PrivacyInfo"] = ("Aviso de privacidad",
                "<p>Consulta nuestro <a href=\"/privacidad\">aviso de privacidad</a> completo.</p>"),
            ["AccessDenied"] = ("", "<p><strong>No tienes acceso a esta página.</strong></p>"),
            ["PageNotFound"] = ("", ""),
            ["ShippingInfo"] = ("Entrega e instalación",
                "<p>Coordinamos transporte, ensamble e instalación según la cobertura y el acceso de tu ciudad. Escríbenos por WhatsApp para confirmar tiempos.</p>"),
            ["ApplyVendor"] = ("", "<p>BEH Formas no opera actualmente un portal de proveedores externos.</p>"),
            ["VendorTermsOfService"] = ("", "<p>BEH Formas no opera actualmente un portal de proveedores externos.</p>"),
            ["KnowledgebaseHomePage"] = ("", "<p>Base de conocimiento BEH.</p>"),
            ["VendorPortalInfo"] = ("Portal de proveedores",
                "<p>BEH Formas no opera actualmente un portal de proveedores externos.</p>")
        };

        var updated = new List<string>();
        var notFound = new List<string>();
        foreach (var (systemName, (title, body)) in content)
        {
            var page = await _pageService.GetPageBySystemName(systemName);
            if (page == null)
            {
                notFound.Add(systemName);
                continue;
            }
            page.Title = title;
            page.Body = body;
            await _pageService.UpdatePage(page);
            updated.Add(systemName);
        }

        return Json(new { updatedCount = updated.Count, updated, notFound });
    }

    private async Task<Grand.Domain.Localization.Language> GetSpanishLanguage()
    {
        var languages = await _languageService.GetAllLanguages(true);
        return languages.FirstOrDefault(l =>
            l.Name.Contains("spanish", StringComparison.OrdinalIgnoreCase) ||
            l.Name.Contains("español", StringComparison.OrdinalIgnoreCase) ||
            l.UniqueSeoCode.Equals("es", StringComparison.OrdinalIgnoreCase))
            ?? languages.FirstOrDefault();
    }

    [HttpGet("beh-tools/audit-missing-keys")]
    public async Task<IActionResult> AuditMissingKeys(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var lang = await GetSpanishLanguage();
        if (lang == null) return Content("No se encontro ningun idioma");

        var existing = _translationService.GetAllResources(lang.Id);
        var existingNames = new HashSet<string>(existing.Select(r => r.Name), StringComparer.OrdinalIgnoreCase);

        var contentRoot = _env.ContentRootPath;
        var keysFile = Path.Combine(contentRoot, "..", "..", "..", "catalog-import", "loc-keys-to-check.json");
        keysFile = Path.GetFullPath(keysFile);
        if (!System.IO.File.Exists(keysFile))
            return Content($"No se encontro {keysFile}");

        var keys = JsonSerializer.Deserialize<List<string>>(await System.IO.File.ReadAllTextAsync(keysFile));

        var missing = keys!.Where(k => !string.IsNullOrWhiteSpace(k) && !existingNames.Contains(k.Trim()))
            .Select(k => k.Trim())
            .Distinct()
            .OrderBy(k => k)
            .ToList();

        var emptyValue = existing.Where(r => string.IsNullOrWhiteSpace(r.Value))
            .Select(r => r.Name).OrderBy(x => x).ToList();

        return Json(new {
            languageId = lang.Id,
            languageName = lang.Name,
            totalExisting = existing.Count,
            totalChecked = keys.Count,
            missingCount = missing.Count,
            missing,
            emptyValueCount = emptyValue.Count,
            emptyValue
        });
    }

    [HttpGet("beh-tools/fix-missing-keys")]
    public async Task<IActionResult> FixMissingKeys(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var lang = await GetSpanishLanguage();
        if (lang == null) return Content("No se encontro ningun idioma");

        var contentRoot = _env.ContentRootPath;
        var translationsFile = Path.GetFullPath(Path.Combine(contentRoot, "..", "..", "..", "catalog-import", "es-translations.json"));
        if (!System.IO.File.Exists(translationsFile))
            return Content($"No se encontro {translationsFile}");

        var translations = JsonSerializer.Deserialize<Dictionary<string, string>>(await System.IO.File.ReadAllTextAsync(translationsFile));

        var existing = _translationService.GetAllResources(lang.Id);
        var existingByName = new Dictionary<string, TranslationResource>(StringComparer.OrdinalIgnoreCase);
        foreach (var r in existing) existingByName.TryAdd(r.Name, r);

        var inserted = new List<string>();
        var updated = new List<string>();
        var errors = new List<string>();

        foreach (var (name, value) in translations!)
        {
            try
            {
                if (existingByName.TryGetValue(name, out var existingResource))
                {
                    if (!string.Equals(existingResource.Value, value, StringComparison.Ordinal))
                    {
                        existingResource.Value = value;
                        await _translationService.UpdateTranslateResource(existingResource);
                        updated.Add(name);
                    }
                }
                else
                {
                    await _translationService.InsertTranslateResource(new TranslationResource {
                        LanguageId = lang.Id,
                        Name = name,
                        Value = value,
                        Area = TranslationResourceArea.Front
                    });
                    inserted.Add(name);
                }
            }
            catch (Exception ex)
            {
                errors.Add($"{name}: {ex.Message}");
            }
        }

        return Json(new {
            languageId = lang.Id,
            insertedCount = inserted.Count,
            inserted,
            updatedCount = updated.Count,
            updated,
            errors
        });
    }

    [HttpGet("beh-tools/fix-missing-admin-keys")]
    public async Task<IActionResult> FixMissingAdminKeys(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var lang = await GetSpanishLanguage();
        if (lang == null) return Content("No se encontro ningun idioma");

        var contentRoot = _env.ContentRootPath;
        var translationsFile = Path.GetFullPath(Path.Combine(contentRoot, "..", "..", "..", "catalog-import", "es-translations-admin.json"));
        if (!System.IO.File.Exists(translationsFile))
            return Content($"No se encontro {translationsFile}");

        var translations = JsonSerializer.Deserialize<Dictionary<string, string>>(await System.IO.File.ReadAllTextAsync(translationsFile));

        var existing = _translationService.GetAllResources(lang.Id);
        var existingByName = new Dictionary<string, TranslationResource>(StringComparer.OrdinalIgnoreCase);
        foreach (var r in existing) existingByName.TryAdd(r.Name, r);

        var inserted = new List<string>();
        var updated = new List<string>();
        var errors = new List<string>();

        foreach (var (name, value) in translations!)
        {
            try
            {
                if (existingByName.TryGetValue(name, out var existingResource))
                {
                    if (!string.Equals(existingResource.Value, value, StringComparison.Ordinal))
                    {
                        existingResource.Value = value;
                        await _translationService.UpdateTranslateResource(existingResource);
                        updated.Add(name);
                    }
                }
                else
                {
                    await _translationService.InsertTranslateResource(new TranslationResource {
                        LanguageId = lang.Id,
                        Name = name,
                        Value = value,
                        Area = TranslationResourceArea.Admin
                    });
                    inserted.Add(name);
                }
            }
            catch (Exception ex)
            {
                errors.Add($"{name}: {ex.Message}");
            }
        }

        return Json(new {
            languageId = lang.Id,
            insertedCount = inserted.Count,
            updatedCount = updated.Count,
            errorsCount = errors.Count,
            errors
        });
    }

    [HttpGet("beh-tools/copy-english-fallback")]
    public async Task<IActionResult> CopyEnglishFallback(string token)
    {
        if (token != "beh-local-2026")
            return Unauthorized("token invalido");

        var lang = await GetSpanishLanguage();
        if (lang == null) return Content("No se encontro ningun idioma");

        var contentRoot = _env.ContentRootPath;
        var xmlPath = Path.Combine(contentRoot, "App_Data", "Resources", "DefaultLanguage.xml");
        if (!System.IO.File.Exists(xmlPath))
            return Content($"No se encontro {xmlPath}");

        var xmlContent = await System.IO.File.ReadAllTextAsync(xmlPath, System.Text.Encoding.Unicode);
        var resourceMatches = Regex.Matches(xmlContent,
            "<Resource Name=\"(?<name>[^\"]+)\"[^>]*>\\s*<Value>(?<value>.*?)</Value>",
            RegexOptions.Singleline);

        var existing = _translationService.GetAllResources(lang.Id);
        var existingNames = new HashSet<string>(existing.Select(r => r.Name), StringComparer.OrdinalIgnoreCase);

        var inserted = 0;
        var errors = new List<string>();
        foreach (Match m in resourceMatches)
        {
            var name = System.Net.WebUtility.HtmlDecode(m.Groups["name"].Value);
            if (existingNames.Contains(name)) continue;
            var value = System.Net.WebUtility.HtmlDecode(m.Groups["value"].Value);
            try
            {
                await _translationService.InsertTranslateResource(new TranslationResource {
                    LanguageId = lang.Id,
                    Name = name,
                    Value = value,
                    Area = TranslationResourceArea.Front
                });
                existingNames.Add(name);
                inserted++;
            }
            catch (Exception ex)
            {
                errors.Add($"{name}: {ex.Message}");
            }
        }

        return Json(new {
            languageId = lang.Id,
            totalInXml = resourceMatches.Count,
            insertedCount = inserted,
            errorsCount = errors.Count,
            errors = errors.Take(20)
        });
    }
}
