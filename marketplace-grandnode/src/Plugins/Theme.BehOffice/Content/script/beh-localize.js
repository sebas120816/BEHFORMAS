(() => {
    "use strict";

    const messages = {
        "account.login": "Iniciar sesión",
        "account.login.fields.email": "Correo electrónico",
        "account.login.fields.password": "Contraseña",
        "account.login.fields.rememberme": "Recordarme",
        "account.login.forgotpassword": "Olvidé mi contraseña",
        "account.login.loginbutton": "Iniciar sesión",
        "account.login.newcustomertext": "Crear una cuenta",
        "account.login.returningcustomer": "Ya tengo una cuenta",
        "account.myaccount": "Mi cuenta",
        "account.register": "Registrarme",
        "account.register.button": "Crear mi cuenta",
        "account.yourpersonaldetails": "Datos personales",
        "account.companydetails": "Datos de empresa",
        "account.youraddress": "Dirección",
        "account.options": "Preferencias",
        "account.yourpassword": "Seguridad de la cuenta",
        "account.fields.firstname": "Nombre",
        "account.fields.lastname": "Apellido",
        "account.fields.email": "Correo electrónico",
        "account.fields.username": "Usuario",
        "account.fields.company": "Empresa",
        "account.fields.vatnumber": "NIT o identificación tributaria",
        "account.fields.streetaddress": "Dirección",
        "account.fields.streetaddress2": "Información adicional",
        "account.fields.zippostalcode": "Código postal",
        "account.fields.city": "Ciudad",
        "account.fields.country": "País",
        "account.fields.stateprovince": "Departamento",
        "account.fields.phonenumber": "Teléfono",
        "account.fields.password": "Contraseña",
        "account.fields.confirmpassword": "Confirmar contraseña",
        "account.fields.newsletter": "Recibir novedades y lanzamientos",
        "account.password": "Seguridad de la cuenta",
        "account.newsletter": "Novedades y lanzamientos",
        "common.continue": "Continuar",
        "common.back": "Volver",
        "common.loadingnextstep": "Cargando el siguiente paso",
        "checkout": "Finalizar compra",
        "checkout.shippingaddress": "Dirección de entrega",
        "checkout.billingaddress": "Datos de facturación",
        "checkout.shippingmethod": "Método de entrega",
        "checkout.paymentmethod": "Método de pago",
        "checkout.paymentinfo": "Información de pago",
        "checkout.confirmorder": "Confirmar pedido",
        "checkout.nopaymentmethods": "No hay métodos de pago disponibles para este pedido. Comunícate con BEH para recibir asistencia.",
        "checkout.termsOfService.iaccept": "Acepto las condiciones de compra",
        "checkout.termsOfService.read": "Leer condiciones",
        "checkout.termsOfService.pleaseaccept": "Debes aceptar las condiciones de compra para continuar.",
        "checkout.button.login": "Ingresar y continuar",
        "checkout.submittingorder": "Registrando tu pedido",
        "categories.breadcrumb.top": "Inicio",
        "addtocart.attributes": "Opciones",
        "addtocart.auctions.ongoing": "Subastas activas",
        "addtocart.cart.items": "Productos en el carrito",
        "addtocart.continue": "Continuar comprando",
        "addtocart.price": "Precio",
        "addtocart.qty": "Cantidad",
        "addtocart.reservationinfo": "Información de reserva",
        "addtocart.shoppingcart": "Carrito",
        "addtocart.subtotal": "Subtotal",
        "addtocart.subtotaldiscount": "Descuento",
        "addtocart.timeleft": "Tiempo restante",
        "addtocart.viewauctions": "Ver subastas",
        "addtocart.viewcart": "Ver carrito",
        "addtocart.viewwishlist": "Ver favoritos",
        "addtocart.wishlist": "Favoritos",
        "addtocart.wishlist.items": "Productos favoritos",
        "addtocart.yourbid": "Tu oferta",
        "catalog.viewmode.grid": "Vista en cuadrícula",
        "catalog.viewmode.list": "Vista en lista",
        "catalog.orderby": "Ordenar por",
        "catalog.pagesize": "Productos por página",
        "catalog.selectors.fiters": "Filtros",
        "catalog.selectors.items": "productos",
        "catalog.selectors.of": "de",
        "catalog.selectors.filters": "Filtros",
        "checkout.button": "Finalizar compra",
        "common.all": "Todo",
        "common.homepage": "Inicio",
        "common.new": "Nuevo",
        "common.close": "Cerrar",
        "home": "Inicio",
        "homepage.products": "Productos destacados",
        "homepage.newproducts": "Nuevas referencias",
        "homepage.categories": "Categorías",
        "products.additionalparameter": "Información adicional",
        "products.availability": "Disponibilidad",
        "products.breadcrumb.top": "Inicio",
        "products.buynowprice": "Comprar ahora",
        "products.callforprice": "Solicitar precio",
        "products.compare.addtocomparelist": "Comparar",
        "products.compare.clear": "Limpiar comparación",
        "products.compare.noitems": "No hay productos para comparar",
        "products.compare.title": "Comparar productos",
        "products.description": "Descripción",
        "products.details": "Detalles",
        "products.discontinued": "Producto no disponible",
        "products.enterproductprice": "Ingresa el precio",
        "products.featuredproducts": "Productos destacados",
        "products.noassociatedproducts": "No hay referencias asociadas",
        "products.price.catalogprice": "Precio de catálogo",
        "products.price.currentprice": "Precio actual",
        "products.price.reservationprice": "Precio de reserva",
        "products.price.startprice": "Precio inicial",
        "products.price.withdiscount": "Precio con descuento",
        "products.producthasbeenaddedtocomparelist.link": "Producto agregado a comparación",
        "products.quickview": "Vista rápida",
        "products.relatedproducts": "Productos relacionados",
        "products.recentlyviewedproducts": "Productos vistos recientemente",
        "products.reviews": "Opiniones",
        "products.contactus": "Consultar este producto",
        "products.reservation.date": "Fecha",
        "products.reservation.datefrom": "Desde",
        "products.reservation.dateto": "Hasta",
        "products.reservation.hour": "Hora",
        "products.specs": "Especificaciones",
        "products.warehouse": "Bodega",
        "reviews.overview.reviews": "reseñas",
        "reviews.overview.first": "Sé la primera persona en opinar",
        "search.brand": "Marcas",
        "search.category": "Categorías",
        "search.noresultstext": "No encontramos productos",
        "search.noresultstextbrand": "No encontramos marcas",
        "search.noresultstextcategory": "No encontramos categorías",
        "search.products": "Productos",
        "search.searchbox.tooltip": "Buscar productos",
        "search.searchtermminimumlengthisncharacters": "Escribe al menos tres caracteres",
        "search.button": "Buscar",
        "search.searchterm": "Buscar producto",
        "search.advancedsearch": "Búsqueda avanzada",
        "search.pricerange": "Rango de precio",
        "search.pricerange.from": "Desde",
        "search.pricerange.to": "Hasta",
        "search.collection": "Colección",
        "search.vendor": "Proveedor",
        "shoppingcart.addtocart": "Agregar al carrito",
        "shoppingcart.addtocart.update": "Actualizar carrito",
        "shoppingcart.addtocomparelist": "Agregar a comparación",
        "shoppingcart.addtowishlist": "Agregar a favoritos",
        "shoppingcart.addtowishlist.update": "Actualizar favoritos",
        "shoppingcart.auctionends": "La subasta termina",
        "shoppingcart.bid": "Ofertar",
        "shoppingcart.bids": "Ofertas",
        "shoppingcart.buynow": "Comprar ahora",
        "shoppingcart.headerquantity": "Productos",
        "shoppingcart.cartisempty": "Tu carrito está vacío",
        "shoppingcart.image": "Imagen",
        "shoppingcart.itemtotal": "Total",
        "shoppingcart.product(s)": "Producto",
        "shoppingcart.quantity": "Cantidad",
        "shoppingcart.unitprice": "Precio unitario",
        "shoppingcart.mini.itemstext": "productos",
        "shoppingcart.mini.nodatatext": "Tu carrito está vacío",
        "shoppingcart.mini.noitems": "No tienes productos en el carrito",
        "shoppingcart.mini.quantity": "Cantidad",
        "shoppingcart.mini.unitprice": "Precio unitario",
        "shoppingcart.mini.viewcart": "Ver carrito",
        "shoppingcart.preorder": "Preordenar",
        "shoppingcart.reservation": "Reservar",
        "shoppingcart.totals.subtotal": "Subtotal",
        "shoppingcart.yourbidhasbeenplaced": "Tu oferta fue registrada",
        "wishlist.headerquantity": "Favoritos",
        "wishlist.mini.itemstext": "favoritos",
        "wishlist.mini.nodatatext": "Aún no tienes favoritos",
        "wishlist.mini.noitems": "No tienes productos favoritos",
        "wishlist.mini.quantity": "Cantidad",
        "wishlist.mini.unitprice": "Precio unitario",
        "title.pagenotfound": "Página no encontrada",
        "sidebar.newcustomer": "Nuevo cliente",
        "footer.information": "Información",
        "footer.myaccount": "Mi cuenta",
        "footer.aboutus": "BEH Formas",
        "newsletter.title": "Novedades BEH",
        "newsletter.desc": "Recibe nuevas referencias y soluciones para oficinas.",
        "newsletter": "Correo electrónico",
        "cookie.description2": "Usamos cookies para recordar tus preferencias, mejorar la tienda y medir el rendimiento del catálogo.",
        "cookie.accept": "Aceptar",
        "cookie.refuse": "Solo necesarias",
        "cookie.learnmore": "Política",
        "common.wait...": "Cargando",
        "contactus": "Contacto",
        "search": "Buscar",
        "products": "Productos",
        "new": "Nuevo",
        "view": "Ver",
        "welcome to our store": "Tienda BEH para oficinas",
        "online shopping is the process consumers go through to purchase products or services over the internet. you can edit this in the admin site.": "Compra mobiliario de oficina en Colombia con acompañamiento BEH para cantidades, acabados, entrega e instalación.",
        "if you have questions, see the documentation, or post in the forums at grandnode.com": "Si necesitas ayuda, nuestro equipo comercial te acompaña por WhatsApp o correo.",
        "documentation": "asesoría BEH",
        "forums": "canales de soporte",
        "others": "Otros",
        "sport": "Oficina",
        "lego": "Accesorios",
        "sort by": "Ordenar por",
        "position": "Relevancia",
        "name asc": "Nombre A-Z",
        "name desc": "Nombre Z-A",
        "price asc": "Menor precio",
        "price desc": "Mayor precio",
        "created on": "Más recientes",
        "best sellers": "Más vendidos",
        "most viewed": "Más vistos",
        "on sale": "En oferta",
        "rating": "Mejor calificación",
        "display": "Mostrar",
        "show": "Mostrar",
        "filter": "Filtrar",
        "remove filters": "Remover filtros",
        "order by": "Ordenar por",
        "a-z": "A-Z",
        "z-a": "Z-A",
        "highest price": "Mayor precio",
        "lowest price": "Menor precio",
        "shoppingcart": "Carrito",
        "blog": "Actualidad"
    };

    const translateValue = (value) => {
        if (!value) return value;
        const trimmed = value.trim().toLowerCase();
        const hasColon = trimmed.endsWith(":");
        const key = hasColon ? trimmed.slice(0, -1) : trimmed;
        return messages[key] ? `${messages[key]}${hasColon ? ":" : ""}` : value;
    };

    const translate = (root) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const translated = translateValue(node.nodeValue);
            if (translated !== node.nodeValue) node.nodeValue = translated;
        }
        if (root.querySelectorAll) {
            root.querySelectorAll("[title], [aria-label], [placeholder], input[value]").forEach((element) => {
                ["title", "aria-label", "placeholder", "value"].forEach((attribute) => {
                    if (!element.hasAttribute(attribute)) return;
                    const value = element.getAttribute(attribute);
                    const translated = translateValue(value);
                    if (translated !== value) element.setAttribute(attribute, translated);
                });
            });
        }
    };

    const removeTemplateBranding = (root) => {
        if (!root.querySelectorAll) return;
        root.querySelectorAll("a, p, div, span").forEach((element) => {
            const text = (element.textContent || "").trim().toLowerCase();
            if (!text.includes("grandnode")) return;
            if (element.children.length > 2) return;
            element.textContent = text.includes("welcome")
                ? "Tienda BEH para oficinas"
                : "Soporte y asesoría BEH para compras empresariales";
        });
        root.querySelectorAll("img").forEach((image) => {
            const alt = (image.alt || "").toLowerCase();
            const src = (image.getAttribute("src") || "").toLowerCase();
            if (!alt.includes("grandnode") && !src.includes("grandnode")) return;
            image.src = "/Plugins/Theme.BehOffice/Content/images/beh/beh-logo.png?v=20260722-2";
            image.alt = "BEH Oficinas";
        });
    };

    document.documentElement.lang = "es";
    translate(document.body);
    removeTemplateBranding(document.body);
    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                translate(node);
                removeTemplateBranding(node);
            }
            if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                translate(node.parentElement);
                removeTemplateBranding(node.parentElement);
            }
        }));
    }).observe(document.body, { childList: true, subtree: true });
})();
