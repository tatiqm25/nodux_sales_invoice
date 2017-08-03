from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _, throw
from frappe.utils import cint, flt
import frappe.defaults

class SalesInvoice(Document):
    def before_save(self):
        self.docstatus = 1
        for item in self.items:
            if item.item_code:
                product = frappe.get_doc("Item", item.item_code)
                if product.total<0:
                    frappe.throw(("El producto {0} no se encuentra disponible en stock").format(item.item_name))
                elif product.total < item.qty:
                    frappe.throw(("No cuenta con suficiente stock del producto {0}").format(item.item_name))
                else:
                    product.total = product.total-item.qty
                    product.save()

    def get_item_details_sale(self, args=None, for_update=False):
        item = frappe.db.sql("""select stock_uom, description, image, item_name,
        list_price, list_price_with_tax, barcode, tax from `tabItem`
        where name = %s
        and disabled=0
        and (end_of_life is null or end_of_life='0000-00-00' or end_of_life > %s)""",
        (args.get('item_code'), nowdate()), as_dict = 1)
        if not item:
            frappe.throw(_("Item {0} is not active or end of life has been reached").format(args.get("item_code")))

            item = item[0]

            ret = {
            'uom'			      	: item.stock_uom,
            'description'		  	: item.description,
            'item_name' 		  	: item.item_name,
            'qty'					: 1,
            'barcode'				: item.barcode,
            'unit_price'			: item.list_price,
            'unit_price_with_tax'	: item.list_price_with_tax,
            'subtotal'				: item.list_price_with_tax
            }

            return ret

    def get_item_code_sale(self, args=None, for_update=False):
        throw(_("START"))
        if cint(self.definir_otra_regla):
            throw(_("REGLA DEFINIDA"))
            if self.pricing_rule:
                rule = self.pricing_rule
                porcentaje = frappe.db.get_value("Pricing Rule", {"title":("like rule")}, "margin_rate_or_amount")
                item = frappe.db.sql("""select price_list_rate from `tabItem Price`
                where item_code = %s""",
                (args.get('item_code')), as_dict = 1)
                if not item:
                    frappe.throw(_("Item {0} doesn't have a defined price").format(args.get("item_code")))

                item = item[0]
                precio_unit = item * (1 + porcentaje/100)

                #item = item[0]
                ret = {
                    "barcode"               : 123,
                    "qty"                   : 1,
                    'rate'			      	: precio_unit
                    # 'description'		  	: item.description,
                    # 'item_name' 		  	: item.item_name,
                    # 'qty'					: 1,
                    # 'barcode'				: item.barcode,
                    # 'unit_price'			: item.list_price,
                    # 'unit_price_with_tax'	: item.list_price_with_tax,
                    # 'subtotal'				: item.list_price_with_tax
                }

                return ret
            else:
                throw(_("Debe elegir una regla de precios"))
            # item = frappe.db.sql("""select stock_uom, description, image, item_name,
            # list_price, name, list_price_with_tax from `tabItem`
            # where barcode = %s
            # and disabled=0
            # and (end_of_life is null or end_of_life='0000-00-00' or end_of_life > %s)""",
            # (args.get('barcode'), nowdate()), as_dict = 1)
            #
            # if not item:
            #     frappe.throw(_("No existe producto con codigo de barra {0}").format(args.get("barcode")))
            #
            #     item = item[0]
            #
            #     ret = {
            #     'uom'			      	: item.stock_uom,
            #     'description'		  	: item.description,
            #     'item_name' 		  	: item.item_name,
            #     'item_code'				: item.name,
            #     'qty'					: 1,
            #     'unit_price'			: item.list_price,
            #     'unit_price_with_tax'	: item.list_price_with_tax,
            #     'subtotal'				: item.list_price_with_tax
            #     }
            #
            #     return ret
