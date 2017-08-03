from __future__ import unicode_literals
import frappe
import json
import copy
from frappe import throw, _
from frappe.utils import flt, cint
from frappe import _
from frappe.model.document import Document

def validate(doc, event):

    if doc.dias_1 and not doc.dias_2 and not doc.dias_3 and not doc.dias_4:
        print "MENSAJE 1"
        for field in ["Termino de Pago"]:
            if (doc.get(frappe.scrub(field))) != "":
                for field in ["Dias 1",]:
                    if float(doc.get(frappe.scrub(field))) <= 0:
                        throw(_("{0} can not be negative").format(field))
                    else:
                        a = float(doc.get(frappe.scrub(field)))
                        if doc.termino_de_pago:
                            termino_de_pago = doc.termino_de_pago
                            numero_dias = frappe.db.get_value("Termino de Pago",{"termino_de_pago": termino_de_pago}, "numero_dias")
                            if a > numero_dias:
                                nuevo_valor = frappe.db.sql("""select termino_de_pago from `tabTermino de Pago`
                        			where numero_dias >= %s""",
                        			    (a), as_dict = 1)
                                if not nuevo_valor:
                                    frappe.throw(_("Termino de Pago {0} is not active").format(a))
                                else:
                                    nuevo_valor = nuevo_valor[0]
                                    doc.termino_de_pago = nuevo_valor.termino_de_pago

    if doc.dias_1 and doc.dias_2 and not doc.dias_3 and not doc.dias_4:
        print "MENSAJE 2"
        for field in ["Termino de Pago"]:
            if (doc.get(frappe.scrub(field))) != "":
                for field in ["Dias 2",]:
                    if float(doc.get(frappe.scrub(field))) <= 0:
                        throw(_("{0} can not be negative").format(field))
                    else:
                        a = float(doc.get(frappe.scrub(field)))
                        if doc.termino_de_pago:
                            termino_de_pago = doc.termino_de_pago
                            numero_dias = frappe.db.get_value("Termino de Pago",{"termino_de_pago": termino_de_pago}, "numero_dias")
                            if a > numero_dias:
                                nuevo_valor = frappe.db.sql("""select termino_de_pago from `tabTermino de Pago`
                        			where numero_dias >= %s""",
                        			    (a), as_dict = 1)
                                if not nuevo_valor:
                                    frappe.throw(_("Termino de Pago {0} is not active").format(a))
                                else:
                                    nuevo_valor = nuevo_valor[0]
                                    doc.termino_de_pago = nuevo_valor.termino_de_pago
    if doc.dias_1 and doc.dias_2 and doc.dias_3 and not doc.dias_4:
        print "MENSAJE 3"
        for field in ["Termino de Pago"]:
            if (doc.get(frappe.scrub(field))) != "":
                for field in ["Dias 3",]:
                    if float(doc.get(frappe.scrub(field))) <= 0:
                        throw(_("{0} can not be negative").format(field))
                    else:
                        a = float(doc.get(frappe.scrub(field)))
                        if doc.termino_de_pago:
                            termino_de_pago = doc.termino_de_pago
                            numero_dias = frappe.db.get_value("Termino de Pago",{"termino_de_pago": termino_de_pago}, "numero_dias")
                            if a > numero_dias:
                                nuevo_valor = frappe.db.sql("""select termino_de_pago from `tabTermino de Pago`
                        			where numero_dias >= %s""",
                        			    (a), as_dict = 1)
                                if not nuevo_valor:
                                    frappe.throw(_("Termino de Pago {0} is not active").format(a))
                                else:
                                    nuevo_valor = nuevo_valor[0]
                                    doc.termino_de_pago = nuevo_valor.termino_de_pago
    if doc.dias_1 and doc.dias_2 and doc.dias_3 and doc.dias_4:
        print "MENSAJE 4"
        for field in ["Termino de Pago"]:
            if (doc.get(frappe.scrub(field))) != "":
                for field in ["Dias 4",]:
                    if float(doc.get(frappe.scrub(field))) <= 0:
                        throw(_("{0} can not be negative").format(field))
                    else:
                        a = float(doc.get(frappe.scrub(field)))
                        if doc.termino_de_pago:
                            termino_de_pago = doc.termino_de_pago
                            numero_dias = frappe.db.get_value("Termino de Pago",{"termino_de_pago": termino_de_pago}, "numero_dias")
                            if a > numero_dias:
                                nuevo_valor = frappe.db.sql("""select termino_de_pago from `tabTermino de Pago`
                        			where numero_dias >= %s""",
                        			    (a), as_dict = 1)
                                if not nuevo_valor:
                                    frappe.throw(_("Termino de Pago {0} is not active").format(a))
                                else:
                                    nuevo_valor = nuevo_valor[0]
                                    doc.termino_de_pago = nuevo_valor.termino_de_pago

    # @frappe.whitelist()
    # def make_purchase_invoice(source_name, target_doc=None):
    #     def postprocess(source, target):
    #         set_missing_values(source, target)
    #         #Get the advance paid Journal Entries in Purchase Invoice Advance
    #         target.set_advances()
    #
    #     def update_item(obj, target, source_parent):
    #         target.amount = flt(obj.amount) - flt(obj.billed_amt)
    #         target.base_amount = target.amount * flt(source_parent.conversion_rate)
    #         target.qty = target.amount / flt(obj.rate) if (flt(obj.rate) and flt(obj.billed_amt)) else flt(obj.qty)
    #         print "QTY ", target.qty
    #         item = frappe.db.get_value("Item", target.item_code, ["item_group", "buying_cost_center"], as_dict=1)
    #         target.cost_center = frappe.db.get_value("Project", obj.project, "cost_center") \
    #             or item.buying_cost_center \
    #             or frappe.db.get_value("Item Group", item.item_group, "default_cost_center")
    #
    #         doc = get_mapped_doc("Purchase Order", source_name,	{
    #         "Purchase Order": {
    #             "doctype": "Purchase Invoice",
    #             "validation": {
    #                 "docstatus": ["=", 1],
    #             }
    #         },
    #         "Purchase Order Item": {
    #             "doctype": "Purchase Invoice Item",
    #             "field_map": {
    #                 "name": "po_detail",
    #                 "parent": "purchase_order",
    #             },
    #             "postprocess": update_item,
    #             "condition": lambda doc: (doc.base_amount==0 or abs(doc.billed_amt) < abs(doc.amount))
    #             },
    #             "Purchase Taxes and Charges": {
    #                 "doctype": "Purchase Taxes and Charges",
    #                 "add_if_empty": True
    #             }
    #         }, target_doc, postprocess)
    #
    #         return doc
    # if doc.referencia_de_proveedor:
    #     frappe.set_value("Purchase Invoice", "Purchase Invoice", "referencia", doc.referencia_de_proveedor);
