#!/usr/bin/env python3
import json
import re
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "LISTA DE PRECIOS PRODUCTOS NUEVOS JUNIO 17 DE 2026.pdf"
OUT = Path(__file__).resolve().parent
IMAGE_DIR = OUT / "products"
IVA = 1.19

products = {}


def money(value):
    return int(str(value).replace(".", ""))


def add(sku, name, cash, term, page, category, warranty, description, slot="top"):
    cash_value = money(cash)
    term_value = money(term)
    products[sku] = {
        "sku": sku,
        "name": name,
        "category": category,
        "priceBeforeTax": cash_value,
        "price": round(cash_value * IVA),
        "price30DaysBeforeTax": term_value,
        "price30Days": round(term_value * IVA),
        "warranty": warranty,
        "description": description.strip(),
        "page": page,
        "slot": slot,
        "image": f"products/{sku.lower().replace('/', '-')}.jpg",
    }


chair = "Sillas de oficina"
visitor = "Sillas interlocutoras"
waiting = "Tándem y salas de espera"
desk = "Escritorios y estaciones"
accessory = "Accesorios para sillas"

estela = (
    "Silla Estela con asiento y respaldo en polipropileno de alto impacto, "
    "cilindro secretarial negro, telescopio, ruedas de nylon de 50 mm y base de nylon de 60 cm."
)
for sku, label, cash, term in [
    ("5-589C", "Estela alta con kit fijo", "199.652", "207.971"),
    ("5-589B", "Estela alta con kit contacto", "202.208", "210.633"),
    ("5-589G", "Estela alta sincro perilla 2 palancas", "213.780", "222.688"),
    ("5-589F", "Estela alta sincro perilla 3 palancas", "232.204", "241.879"),
    ("5-589E", "Estela alta sincro cremallera 2 palancas", "235.966", "245.798"),
    ("5-589D", "Estela alta sincro cremallera 3 palancas", "251.805", "262.297"),
    ("5-590D", "Estela media con kit fijo", "188.061", "195.897"),
    ("5-590C", "Estela media con kit graduable", "187.495", "195.307"),
    ("5-590B", "Estela media con kit contacto", "190.617", "198.560"),
    ("5-590H", "Estela media sincro perilla 2 palancas", "202.190", "210.614"),
    ("5-590G", "Estela media sincro perilla 3 palancas", "220.613", "229.805"),
    ("5-590F", "Estela media sincro cremallera 2 palancas", "224.375", "233.724"),
    ("5-590E", "Estela media sincro cremallera 3 palancas", "240.215", "250.223"),
]:
    add(sku, label, cash, term, 3, chair, "3 años", estela, "top" if "alta" in label else "bottom")

add("003-0111", "Par de brazos fijos Beijing", "18.137", "18.892", 3, accessory, "Según instalación", "Par de brazos fijos tipo T para silla operativa.")
add("003-0110", "Par de brazos graduables Lisboa", "24.472", "25.492", 3, accessory, "Según instalación", "Par de brazos graduables con cojín en polipropileno.")
add("003-0124", "Par de brazos 3D Sevilla", "35.480", "36.958", 3, accessory, "Según instalación", "Brazos graduables 3D: giro, desplazamiento y ajuste de altura.")


def chair_pair(page, model, color, manager_sku, president_sku, prices, warranty, mechanism):
    description = (
        f"Silla {model} con marco {color}, respaldo en malla, {mechanism}. "
        "Configuración para trabajo corporativo con soporte lumbar y componentes graduables."
    )
    add(president_sku, f"{model} Presidente - {color}", prices[0], prices[1], page, chair, warranty, description, "top")
    add(manager_sku, f"{model} Gerente - {color}", prices[2], prices[3], page, chair, warranty, description, "bottom")


chair_pair(4, "Oslo", "negro", "003-3782", "003-3780", ["510.145", "531.401", "477.808", "497.717"], "7 años", "mecanismo sincro autopeso con slider y brazos 4D")
chair_pair(5, "Oxford", "negro", "003-3788", "003-3786", ["502.516", "523.454", "468.068", "487.571"], "7 años", "mecanismo sincro autopeso con slider y brazos 4D")
chair_pair(6, "Boston", "negro", "003-3794", "003-3792", ["423.683", "441.337", "405.135", "422.016"], "5 años", "mecanismo sincro autopeso con slider y brazos 4D")
chair_pair(7, "Derby", "negro", "003-3800", "003-3798", ["312.393", "325.409", "292.519", "304.707"], "3 años", "mecanismo sincro de cuatro bloqueos")
chair_pair(8, "Hamburgo", "negro", "003-0909", "003-0907", ["373.580", "389.146", "346.751", "361.199"], "3 años", "mecanismo sincro de múltiples bloqueos")
chair_pair(9, "Blas", "negro", "003-3806", "003-3804", ["372.476", "387.996", "352.602", "367.294"], "5 años", "mecanismo basculante, apoyo lumbar fijo y brazos fijos")
add("003-3810", "Zurich Gerente - negro", "199.628", "207.946", 10, chair, "3 años", "Silla Zurich en malla negra translúcida, mecanismo basculante, apoyo lumbar y brazos fijos.")

add("003-1693", "Cambio a base Trevi cromada 64 cm", "8.403", "8.753", 4, accessory, "Según instalación", "Excedente para cambiar base negra Italia por base Trevi cromada de 64 cm.")
add("003-0256", "Cambio a base LI aluminio 64 cm", "49.120", "51.167", 4, accessory, "Según instalación", "Excedente para cambiar base Italia o Trevi por base LI de aluminio de 64 cm.")
add("003-0101", "Módulo slider para silla", "31.340", "32.646", 7, accessory, "Según instalación", "Módulo slider para graduar la profundidad del asiento.")
add("003-0195", "Cambio a ruedas de piso duro", "11.008", "11.467", 7, accessory, "Según instalación", "Excedente para ruedas aptas para piso duro.")

add("003-3814", "Granada interlocutora con ruedas", "196.491", "204.678", 11, visitor, "4 años", "Silla interlocutora plegable con estructura negra, asiento tapizado, espalda en malla, brazos deslizables y ruedas.", "top")
add("003-3812", "Granada interlocutora", "190.618", "198.560", 11, visitor, "4 años", "Silla interlocutora plegable con estructura negra, asiento tapizado, espalda en malla y brazos deslizables.", "bottom")

chair_pair(12, "Oslo", "gris", "003-3785", "003-3783", ["564.674", "588.202", "531.069", "553.197"], "7 años", "mecanismo sincro autopeso con slider y brazos 4D")
chair_pair(13, "Oxford", "gris", "003-3791", "003-3789", ["577.373", "601.430", "544.250", "566.927"], "7 años", "mecanismo sincro autopeso con slider y brazos 4D")
chair_pair(14, "Boston", "gris", "003-3797", "003-3795", ["504.503", "525.524", "481.317", "501.372"], "5 años", "mecanismo sincro autopeso con slider y brazos 4D")
chair_pair(15, "Derby", "gris", "003-3803", "003-3801", ["345.516", "359.912", "325.642", "339.210"], "3 años", "mecanismo sincro de cuatro bloqueos")
chair_pair(16, "Hamburgo", "gris", "003-0912", "003-0910", ["403.760", "420.583", "376.931", "392.636"], "3 años", "mecanismo sincro de múltiples bloqueos")

add("003-0888", "Hawai Gerente sincro - blanco y gris", "340.720", "354.917", 18, chair, "3 años", "Silla Hawai con marco blanco, espalda en malla gris, mecanismo sincro de cuatro bloqueos, soporte lumbar 2D y brazos graduables.", "bottom")
add("003-0886", "Cabecero para silla Hawai", "25.605", "26.672", 18, accessory, "Según instalación", "Cabecero para convertir la silla Hawai gerente en configuración presidente.", "top")
add("003-0890", "Hawai Gerente basculante - blanco y gris", "293.359", "305.582", 19, chair, "3 años", "Silla Hawai con mecanismo basculante, marco blanco, espalda en malla gris, apoyo lumbar 2D y brazos graduables.", "bottom")
add("003-0209", "Cambio a base blanca para silla", "13.046", "13.590", 17, accessory, "Según instalación", "Excedente de base cromada a base blanca.")
add("003-0200", "Cambio a ruedas grises 65 mm", "9.602", "10.002", 17, accessory, "Según instalación", "Excedente para ruedas de piso duro grises de 65 mm.")
add("003-0073", "Cambio a ruedas grises 50 mm", "2.252", "2.346", 17, accessory, "Según instalación", "Excedente para ruedas grises de 50 mm.")

chair_pair(20, "Blas", "gris", "003-3809", "003-3807", ["438.058", "456.310", "408.910", "425.948"], "5 años", "mecanismo basculante, apoyo lumbar fijo y brazos fijos")
add("003-3811", "Zurich Gerente - gris", "229.902", "239.481", 21, chair, "3 años", "Silla Zurich con marco gris, espalda en malla gris, mecanismo basculante, apoyo lumbar y brazos fijos.")

add("003-0780", "Bilbao Eco #3 Gerente - negro", "107.844", "112.337", 23, chair, "6 meses", "Silla Bilbao con base cromada, asiento en paño negro y espalda en malla negra sin cabecero.", "top")
add("003-0931", "Cabecero Bilbao Eco #3", "19.972", "20.804", 23, accessory, "6 meses", "Cabecero para configuración presidente Bilbao Eco #3.", "top")
add("003-1692", "Capri Eco #3 Gerente - negro", "115.367", "120.174", 23, chair, "6 meses", "Silla Capri con base cromada, asiento en paño negro y espalda en malla negra sin cabecero.", "middle")
add("003-1064", "Cabecero Capri Eco #3", "24.769", "25.801", 23, accessory, "6 meses", "Cabecero para configuración presidente Capri Eco #3.", "middle")
add("003-0776", "Atlanta Eco #3 - negro", "95.172", "99.137", 23, chair, "6 meses", "Silla Atlanta con base cromada, asiento en paño negro y respaldo en malla negra.", "bottom")

for row in [
    ("003-0777", "Interlocutora Bilbao - negro", "98.512", "102.617", "Estructura cromada, asiento negro y espalda en malla negra."),
    ("003-0771", "España Eco #3 - negro", "107.912", "112.408", "Base cromada, asiento en paño negro y espalda en malla negra."),
    ("003-0772", "Interlocutora España - negro", "103.263", "107.566", "Estructura cromada, asiento negro y espalda en malla negra."),
    ("003-1115", "Dublin Eco #2 interlocutora - negro", "112.617", "117.309", "Silla plegable con estructura negra, asiento tapizado, espalda plástica y brazos deslizables."),
    ("003-0775", "Risma Eco interlocutora", "44.598", "46.456", "Silla interlocutora sin tapizar, con estructura y plásticos negros."),
]:
    add(row[0], row[1], row[2], row[3], 24, visitor, "1 año" if row[0] in {"003-1115", "003-0775"} else "6 meses", row[4])

for row in [
    ("003-0860", "Bilbao Eco #3 Gerente - blanco y gris", "122.312", "127.408", "Base cromada, asiento en paño gris y espalda en malla gris sin cabecero."),
    ("003-0941", "Cabecero Bilbao Eco #3 gris", "18.470", "19.240", "Cabecero para configuración presidente Bilbao Eco #3 gris."),
    ("003-0855", "Atlanta Eco #3 - blanco y gris", "109.640", "114.208", "Base cromada, asiento en paño gris y espalda en malla gris."),
    ("003-0856", "Interlocutora Atlanta - blanco y gris", "118.495", "123.432", "Estructura cromada, asiento en paño gris y espalda en malla gris."),
    ("003-0857", "España Eco #3 - blanco y gris", "121.628", "126.696", "Base cromada, asiento en paño gris y espalda en malla gris."),
    ("003-0858", "Interlocutora España - blanco y gris", "112.730", "117.427", "Estructura cromada, asiento en paño gris y espalda en malla gris."),
    ("003-1117", "Dublin Eco #2 interlocutora - blanco", "121.104", "126.150", "Silla plegable con estructura blanca, asiento negro, espalda plástica y brazos deslizables."),
]:
    category = accessory if row[0] == "003-0941" else visitor if "Interlocutora" in row[1] or "Dublin" in row[1] else chair
    add(row[0], row[1], row[2], row[3], 25, category, "1 año" if row[0] == "003-1117" else "6 meses", row[4])

for sku, name, cash, term in [
    ("003-3100", "Tándem acero cromo - 4 puestos", "428.170", "446.010"),
    ("003-3101", "Tándem acero cromo - 3 puestos", "337.509", "351.572"),
    ("003-3102", "Tándem acero cromo - 2 puestos", "287.937", "299.934"),
    ("003-3197", "Tándem Junior cromo Eco #2 - 4 puestos", "337.579", "351.645"),
    ("003-3198", "Tándem Junior cromo Eco #2 - 3 puestos", "243.171", "253.303"),
    ("003-3199", "Tándem Junior cromo Eco #2 - 2 puestos", "217.580", "226.646"),
]:
    add(sku, name, cash, term, 26, waiting, "2 años", "Tándem para sala de espera con estructura resistente y configuración de puestos indicada.")

for sku, name, cash, term in [
    ("003-3500", "Tándem Junior tapizado completo - 4 puestos", "495.441", "516.084"),
    ("003-3501", "Tándem Junior tapizado completo - 3 puestos", "361.568", "376.633"),
    ("003-3502", "Tándem Junior tapizado completo - 2 puestos", "296.511", "308.866"),
    ("003-3514", "Tándem Junior tapizado 2 partes - 4 puestos", "427.876", "445.704"),
    ("003-3515", "Tándem Junior tapizado 2 partes - 3 puestos", "310.894", "323.848"),
    ("003-3516", "Tándem Junior tapizado 2 partes - 2 puestos", "262.729", "273.676"),
]:
    add(sku, name, cash, term, 27, waiting, "2 años", "Tándem Junior con estructura gris y cromo, tapizado en cuero sintético negro.")

for sku, name, cash, term, description in [
    ("003-3724", "Escritorio digital elevable blanco", "406.657", "423.601", "Superficie MDF blanca de 120 x 60 cm, memoria de tres alturas, sistema anticolisión y capacidad de 70 kg."),
    ("003-3733", "Escritorio digital elevable negro", "428.632", "446.492", "Superficie MDF negra de 120 x 60 cm y estructura metálica blanca regulable."),
    ("003-3734", "Escritorio digital elevable gris", "428.632", "446.492", "Superficie MDF gris de 120 x 60 cm y estructura metálica blanca regulable."),
    ("003-3727", "Escritorio ejecutivo Merliet 200 cm", "678.203", "706.461", "Escritorio ejecutivo en L de 200 x 160 x 75 cm."),
    ("003-3726", "Escritorio ejecutivo Merliet 180 cm", "631.891", "658.220", "Escritorio ejecutivo en L de 180 x 160 x 75 cm."),
    ("003-3731", "Escritorio operativo Kafka", "253.143", "263.691", "Escritorio operativo de 120 x 60 x 75 cm con un cajón y un compartimiento."),
]:
    add(sku, name, cash, term, 29, desk, "3 años", description)

add("003-3728", "Isla operativa Orama - 4 puestos", "610.361", "635.793", 30, desk, "3 años", "Isla operativa de cuatro puestos con cuatro compartimientos, medidas 240 x 160 x 75 cm.", "top")
add("003-3732", "Biblioteca Victoria", "1.111.138", "1.157.435", 30, desk, "3 años", "Biblioteca de gran formato, medidas 200 x 40 x 200 cm.", "bottom")


def crop_for(product):
    slot = product["slot"]
    if slot == "top":
        return fitz.Rect(25, 120, 285, 465)
    if slot == "bottom":
        return fitz.Rect(25, 455, 285, 800)
    if slot == "middle":
        return fitz.Rect(25, 285, 285, 610)
    return fitz.Rect(25, 120, 285, 790)


def main():
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    document = fitz.open(PDF)
    for product in products.values():
        page = document[product["page"] - 1]
        rect = crop_for(product) & page.rect
        pixmap = page.get_pixmap(matrix=fitz.Matrix(2.2, 2.2), clip=rect, alpha=False)
        image_path = OUT / product["image"]
        pixmap.save(image_path, jpg_quality=90)

    payload = {
        "source": PDF.name,
        "effectiveDate": "2026-06-17",
        "currency": "COP",
        "sourcePricesIncludeTax": False,
        "taxRate": 0.19,
        "productCount": len(products),
        "products": list(products.values()),
    }
    (OUT / "catalog.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Generated {len(products)} products and {len(products)} images")


if __name__ == "__main__":
    main()
