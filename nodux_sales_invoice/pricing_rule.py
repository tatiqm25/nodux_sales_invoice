from __future__ import unicode_literals
import frappe
import json
import copy
from frappe import throw, _
from frappe.utils import flt, cint
from frappe.model.document import Document

def validate(doc, event):
	#Validar que no se ingresen porcentajes negativos
	for field in ["Margin Rate or Amount"]:
		if flt(doc.get(frappe.scrub(field))) <= 0:
			throw(_("{0} can not be negative or cero").format(field))

	if cint(doc.definir_como_precio_de_venta):
		if frappe.db.get_value("Pricing Rule", {"definir_como_precio_de_venta": 1}):
			throw(_("Ya se encuentra definido un valor como precio de venta"))
