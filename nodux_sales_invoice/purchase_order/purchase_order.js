frappe.ui.form.on('Purchase Order', {

  onload: function(frm){
		var me = this;
		if (!frm.doc.status)
			 frm.doc.status = 'Draft';
       frm.doc.invoice_status ="None";
       frm.doc.shipping_status ="None";
		   frm.refresh_fields();
	},
  // refresh: function(){
  refresh: function(frm){
    var me = this;
    if(frm.doc.docstatus == 1 && frm.doc.status != "Closed") {
      alert("PURCHASE INVOICE");
      if(flt(frm.doc.per_billed, 2) < 100){
        // frm.events.make_purchase_invoice_prueba(frm);
        cur_frm.add_custom_button(__('Invoice 1'),
					frm.events.make_purchase_invoice_prueba, __("Make"));
            //  cur_frm.add_custom_button(__('Invoice'), function() {
            //    cur_frm.make_purchase_invoice_prueba(), __("Make");
            //    });
            // alert("INGRESAR METODO");
      }
      cur_frm.page.set_inner_btn_group_as_primary(__("Make"));
    }
  },

  make_purchase_invoice_prueba: function(frm) {
    alert("AQUI METODO");
		frappe.model.open_mapped_doc({
			method: "nodux_sales_invoice.purchase_invoice.make_purchase_invoice_prueba",
			frm: cur_frm
      // frm: frm.doc
		})
	},
  update_to_quotation_purchase: function(frm) {
		return frappe.call({
			method: "nodux_sales_invoice.purchase_order.update_to_quotation_purchase",
			freeze: true,
			callback: function(r) {
				frm.refresh_fields();
				frm.refresh();
			}
		})
	},
  update_to_confirm_purchase: function(frm) {
		return frappe.call({
			method: "nodux_sales_invoice.purchase_order.update_to_confirm_purchase",
			freeze: true,
			callback: function(r) {
				frm.refresh_fields();
				frm.refresh();
			}
		})
	},
});
frappe.ui.form.on('Purchase Order Item',{
  item_code: function(frm, cdt, cdn){
    var d = locals[cdt][cdn];
    //msgprint("valor de d: " + d.item_code);
    if (d.item_code) {
      return frappe.call({
				method: "nodux_sales_invoice.purchase_order.get_item_code_sale",
        args: {
          item_code 	: d.item_code
        },
				callback: function(r) {
					if(r.message) {
						var d = locals[cdt][cdn];
						$.each(r.message, function(k, v) {
							d[k] = v;
						});
						refresh_field("items");
						frm.refresh_fields();
            calculate_base_imponible(frm);
					}
				}
			});
      frm.refresh_fields();
    }
  },
  qty: function(frm, cdt, cdn) {
		var a = locals[cdt][cdn];
		if(a.qty) {
      var unit_price = 0;
      var qty = 0;
      var subtotal = 0;

      unit_price = a.unit_price;
      qty = a.qty;
      subtotal = unit_price * qty;
      a.subtotal = subtotal;

      refresh_field("items");
			cur_frm.refresh_fields();
      calculate_base_imponible(frm);
		}
	},
  discount: function(frm, cdt, cdn){
    var a = locals[cdt][cdn];
    if (a.discount) {
      var discount = 0;
      var p_unit = 0;
      var new_p_unit = 0;
      var subtotal = 0;

      discount = a.discount;
      p_unit = (a.unit_price) * (discount / 100);
      new_p_unit = a.unit_price_with_no_dcto - p_unit;
      a.unit_price = new_p_unit;
      subtotal = a.qty * new_p_unit;
      a.subtotal = subtotal;
      refresh_field("items");
			cur_frm.refresh_fields();
      calculate_base_imponible(frm);

    }
  }
})

var calculate_base_imponible = function(frm) {
	var doc = frm.doc;
	doc.base_imponible = 0;
	doc.impuesto = 0;
	doc.total_1 = 0;

	if(doc.items) {
		$.each(doc.items, function(index, data){
			doc.base_imponible += (data.unit_price * data.qty);
			doc.impuesto += (data.unit_price_with_tax - data.unit_price) * data.qty;
		})
		doc.total_1 += doc.base_imponible + doc.impuesto;
    //doc.total = doc.impuesto;
	}
	refresh_field('base_imponible')
	refresh_field('impuesto')
	refresh_field('total_1')
}
