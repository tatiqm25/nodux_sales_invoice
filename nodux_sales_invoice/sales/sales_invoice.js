frappe.ui.form.on('Sales Invoice', {
	onload: function(frm){
		msgprint("BIENVENIDO");
		if (!frm.doc.status)
			frm.doc.status = 'Draft';
		frm.refresh_fields();
	},
	refresh: function(frm) {

	},
	customer: function(frm){
		if (frm.doc.customer) {
			frm.set_value("vendedor", frappe.user.name);
        var resp = frappe.db.get_value("Pricing Rule", {"definir_como_precio_de_venta": 1}, "title", function(r) {
          if (resp!=null) {
            frm.set_value("pricing_rule", r.title);
            refresh_field(['rules']);
          } else {
            msgprint("No hay un valor definido de regla de precios... debe definir primero un valor en la regla de precios")
          }
        refresh_field(['rules']);
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
									data.rate = nuevo_punit;
									refresh_field('items');
								})
						})
					//}
					refresh_field('items');
				}
				else {
					msgprint("LA TABLA NO ESTÁ CARGADA");
				}

			} else {
				//msgprint("NO HACER NADA");
			}
 	 })

		} else {
			msgprint("Defina un valor de regla de precios... este campo no puede estar vacío");

		}
	}
  // get_pricing_rule: function(frm) {
	// 	  return frappe.call({
	// 		doc: frm.doc,
	// 		method: "sales.sales_invoice.get_pricing_rule",
	// 		freeze: true,
	// 		callback: function(r) {
	// 			frm.refresh_fields();
	// 			frm.refresh();
	// 		}
	// 	})
	// },

});

frappe.ui.form.on('Sales Invoice Item', {
	// barcode: function(frm, cdt, cdn) {
	// 	var d = locals[cdt][cdn];
	// 	if(d.barcode) {
	// 		args = {
	// 			'barcode'			: d.barcode
	// 		};
	// 		return frappe.call({
	// 			doc: cur_frm.doc,
	// 			method: "get_item_code_sale",
	// 			args: args,
	// 			callback: function(r) {
	// 				if(r.message) {
	// 					var d = locals[cdt][cdn];
	// 					$.each(r.message, function(k, v) {
	// 						d[k] = v;
	// 					});
	// 					refresh_field("items");
	// 					cur_frm.refresh_fields();
	// 					calculate_base_imponible(frm);
	// 				}
	// 			}
	// 		});
	// 	}
	// 	cur_frm.refresh_fields();
	// },
	item_code: function(frm, cdt, cdn) {
		// var d = locals[cdt][cdn];
		// // var base_imponible = 0;
		// // var total_taxes = 0;
		// // var total = 0;
		// var doc = frm.doc;

		// if(d.item_code) {
		// 	args = {
		// 		// 'item_code'			: d.item_code,
		// 		// 'qty'				: d.qty
		// 		'item_code'			: d.item_code
		// 	};
		// 	return frappe.call({
		// 		doc: cur_frm.doc,
		// 		method: "nodux_sales_invoice.nodux_sales_invoice.sales.get_item_code_sale",
		// 		args: args,
		// 		callback: function(r) {
		// 			if(r.message) {
		// 				var d = locals[cdt][cdn];
		// 				$.each(r.message, function(k, v) {
		// 					d[k] = v;
		// 				});
		// 				refresh_field("items");
		// 				cur_frm.refresh_fields();
		// 			}
		//
		// 		}
		// 	});
		// 	frm.refresh_fields();
		// }

	}

})
