from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _, throw
from frappe.utils import cint, flt
import frappe.defaults

class PurchaseOrder(Document):
    pass

@frappe.whitelist()
def get_item_code_sale(item_code):
    #print "VALOR ARGS:", item_code
    item = frappe.db.sql("""select item_name,description,stock_uom,cost_price,unit_price_with_tax from `tabItem`
        where item_code = %s""",
        (item_code), as_dict = 1)

    if not item:
        frappe.throw(_("Item {0} doesn't have a defined price").format(item_code))
    item = item[0]

    ret ={
		'item_name' 		  	     : item.item_name,
        'description'		  	     : item.description,
        'stock_uom'			         : item.stock_uom,
		'qty'					     : 1,
		'unit_price'			     : item.cost_price,
		'unit_price_with_no_dcto'	 : item.cost_price,
        'unit_price_with_tax'	     : item.unit_price_with_tax,
		'subtotal'				     : item.cost_price
    }
    return ret
