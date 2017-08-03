frappe.ui.form.on('Delivery Note', {
  onload: function(frm){
    msgprint("NOTA DE ENTREGA");
  },
  customer: function(frm){
  	if (frm.doc.customer) {
  		 var resp = frappe.db.get_value("Pricing Rule", {"definir_como_precio_de_venta": 1}, "title", function(r) {
          if (resp!=null) {
            frm.set_value("pricing_rule", r.title);
            refresh_field(["pricing_rule"]);
          } else {
            msgprint("No hay un valor definido de regla de precios... debe definir primero un valor en la regla de precios")
          }
        refresh_field(["pricing_rule"]);
      })
  	}
  	frm.refresh_fields();
  },
  pricing_rule: function(frm){
		if (frm.doc.pricing_rule) {
			var rule = frm.doc.pricing_rule;
			var default_rule = "";
			var item_code = "";
			var cost_price = 0;
			var porcentaje_nuevo = 0;
			var nuevo_punit = 0;
			frappe.db.get_value("Pricing Rule", {"definir_como_precio_de_venta": 1}, "title", function(r) {
 			  default_rule = r.title;
  			if (default_rule != rule) {
  				//Obtener el valor del porcentaje de la nueva regla
  	      frappe.db.get_value("Pricing Rule", {"title": frm.doc.pricing_rule}, "margin_rate_or_amount", function(r) {
  						porcentaje_nuevo = r.margin_rate_or_amount;
  	      })
  				if (frm.doc.items) {
  					//for (item in frm.doc.items) {
  						//item_code = item.item_code;
  						$.each(frm.doc.items, function(index, data){
  								item_code = data.item_code_1;
  								frappe.db.get_value("Item", {"item_code":  item_code}, "cost_price", function(r) {
  									cost_price = r.cost_price;
  									nuevo_punit = cost_price * (1 + porcentaje_nuevo/100);
  									data.unit_price = nuevo_punit;
                    data.subtotal = data.qty * data.unit_price;
  									refresh_field('items');
                    calculate_base_imponible(frm);
  								})
  						})
  					//}
  					refresh_field('items');

  				}
				else {
					msgprint("LA TABLA NO ESTÁ CARGADA");
				}

			} else {

			}
 	  })
		} else {
			msgprint("Defina un valor de regla de precios... este campo no puede estar vacío");

		}
	}
});

frappe.ui.form.on('Delivery Note Item',{
  item_code_1: function(frm, cdt, cdn){
    var d = locals[cdt][cdn];
    if (d.item_code_1) {
      // args = {
      //   'item_code'			 : d.item_code_1
			// 	//'qty'				     : d.qty
			// };
      return frappe.call({
				method: "nodux_sales_invoice.delivery_note.get_item_code_sale",
				//args: args,
        args: {
          item_code 	: d.item_code_1
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
	}
	refresh_field('base_imponible')
	refresh_field('impuesto')
	refresh_field('total_1')
}
