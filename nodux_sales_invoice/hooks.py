# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "nodux_sales_invoice"
app_title = "Nodux Sales Invoice"
app_publisher = "nodux"
app_description = "Nodux Sales Invoice"
app_icon = "octicon octicon-file-directory"
app_color = "red"
app_email = "jessicat@nodux.ec"
app_license = "MIT"
# fixtures = ["Pricing Rule","Sales Invoice","Sales Invoice Item","Item","Delivery Note","Delivery Note Item","Purchase Order",
#             "Purchase Order Item", "Purchase Invoice"]


fixtures = [{ "doctype": "DocType",                 
			 "filters": { "custom" : ["=", "1"] }},          	
			 "Pricing Rule","Sales Invoice","Sales Invoice Item","Item","Delivery Note","Delivery Note Item","Purchase Order",
            "Purchase Order Item", "Purchase Invoice"]


doctype_js = {
   "Sales Invoice": ["sales/sales_invoice.js"],
   "Delivery Note": ["delivery_note/delivery.js"],
   "Purchase Order": ["purchase_order/purchase_order.js"],
   "Purchase Invoice": ["purchase_invoice/purchase_invoice.js"]
}
doctype_py = {
     "Delivery Note Item": ["delivery_note/delivery_note.py"]
}
 #include py in page
    #page_py = {"Delivery Note" : "delivery_note/delivery_note.py"}
# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/nodux_sales_invoice/css/nodux_sales_invoice.css"
# app_include_js = "/assets/nodux_sales_invoice/js/nodux_sales_invoice.js"

# include js, css files in header of web template
# web_include_css = "/assets/nodux_sales_invoice/css/nodux_sales_invoice.css"
# web_include_js = "/assets/nodux_sales_invoice/js/nodux_sales_invoice.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "nodux_sales_invoice.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "nodux_sales_invoice.install.before_install"
# after_install = "nodux_sales_invoice.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "nodux_sales_invoice.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#

# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }
doc_events = {
    "Pricing Rule": {
        "validate": "nodux_sales_invoice.pricing_rule.validate"
    },
    "Purchase Order": {
        "validate": "nodux_sales_invoice.purchase.validate"
    },
    "Purchase Invoice":{
        "after_save": "nodux_sales_invoice.purchase_invoice.validate"
    }

}
hooks = ["definir_como_precio_de_venta","venta","plan_acumulativo","bloquear_credito","limite_de_credito","tienda","vendedor",
    "bodega","pricing_rule",
    "item_code_1",
    "cost_price","unit_price","unit_price_with_tax",
    "formas_de_pago_sri","termino_de_pago", "pricing_rule","base_imponible","impuesto","total_1",
    "unit_price","unit_price_with_no_dcto","discount","subtotal",
    "referencia_de_proveedor","numero_de_pagos","dias_1","dias_2","dias_3","dias_4","termino_de_pago","bodega",
    "invoice_status","shipping_status",
    "unit_price_with_no_dcto","unit_price","discount","subtotal",
    "referencia_de_proveedor","fecha_de_autorizacion","no_genera_retencion","base_imponible","impuesto","total_1"]

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"nodux_sales_invoice.tasks.all"
# 	],
# 	"daily": [
# 		"nodux_sales_invoice.tasks.daily"
# 	],
# 	"hourly": [
# 		"nodux_sales_invoice.tasks.hourly"
# 	],
# 	"weekly": [
# 		"nodux_sales_invoice.tasks.weekly"
# 	]
# 	"monthly": [
# 		"nodux_sales_invoice.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "nodux_sales_invoice.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "nodux_sales_invoice.event.get_events"
# }
