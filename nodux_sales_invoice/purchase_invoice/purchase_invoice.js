var total_ret = 0;
var iva = "";
var impuesto_fuente = "";
var ret_iva = 0;
var ret_imp = 0;
var ret_iva1 = 0;
var ret_imp1 = 0;
var envio=true;

frappe.ui.form.on('Purchase Invoice',{
  onload: function(frm){
		if (!frm.doc.status){
      frm.doc.status = 'Draft';
		  frm.refresh_fields();
    }
  },

  refresh: function(frm){
    if (frm.doc.status == 'Unpaid') {
        frm.add_custom_button(__("Pagar"), function() {
          if (cint(frm.doc.no_genera_retencion)) {
            msgprint("No se va a generar retención");
          } else {
            frm.events.present_jdialog(frm);
          }
  			}).addClass("btn-primary");
    }
  },


  present_jdialog: function(frm) {
    var supplier        = "";
    var cadena          = "";
    var num_factura     = "";
    var ref             = "";
    var porc_iva        = "";
    var porc_imp        = "";
    var impuesto        = "";
    var base_imp        = "";
    var totalfac        = "";
    var call            = "";
    var b               = "";
    totalfact           = frm.doc.total_1;
    base_imp            = frm.doc.base_imponible;
    cadena              = frm.doc.referencia_de_proveedor;
    num_factura         = frm.doc.name;
    supplier            = frm.doc.supplier;
    impuesto            = frm.doc.impuesto;
    var conteo1         = cadena.length;
    var cer             =" ";
    var porcion         = cadena.substring(8,0);
    var porcion1        = cadena.substring(8,conteo1);
    var umeroCaracteres = porcion1.length;
    var cab=num_factura;
    //agregar ceros a factura
    var pago_sin_rete=base_imp+impuesto;

    if (umeroCaracteres != 9) {
      var cont =  9 - umeroCaracteres;
      for (var i = 0; i < cont; i++) {
        cer=cer+"0";
      }
    }
    var ultima = porcion + cer + porcion1;

    //Búsqueda del impuesto IVA del proveedor
    frappe.db.get_value("Supplier", {"supplier_name": supplier}, "iva", function(r){
      iva = r.iva;
      d.set_value("iva",iva);
      if (iva != "" ) {
        frappe.db.get_value("Impuesto", {"imp_name": iva}, "percentage", function(r){
          porc_iva = r.percentage;
          if (porc_iva != null) {
            ret_iva = impuesto * (porc_iva/100);
            d.set_value("ret_iva",ret_iva);
          }else{
            alert("No hya valor de retencion");
          }
        })
      }else{
        msgprint("Este proveedor no tiene configurado el IVA en la retención... Debe configurar primero");
      }
    })

    //Búsqueda del impuesto fuente del proveedor
    frappe.db.get_value("Supplier", {"supplier_name": supplier}, "impuesto_fuente",function(r){
      impuesto_fuente = r.impuesto_fuente;
      d.set_value("impuesto_fuente",impuesto_fuente);
      if (impuesto_fuente != "") {
        frappe.db.get_value("Impuesto", {"imp_name": impuesto_fuente}, "percentage",function(r){
          porc_imp = r.percentage;
          if (porc_imp != null) {
            ret_imp = base_imp * (porc_imp/100);
             d.set_value("ret_imp", ret_imp);
            total_ret = ret_iva + ret_imp;
            d.set_value("total_retencion",total_ret);
          }
        })
      }else{
        msgprint("Este proveedor no tiene configurado el impuesto fuente en la retención... Debe configurar primero");
      }
    })

    var d = new frappe.ui.Dialog({
      'fields': [
          {'fieldname': 'ht', 'fieldtype': 'HTML'},
          {"fieldname":"tipo", "fieldtype":"Data", "label":__("Tipo"),
  					'options':"Retención a Proveedor", "default": "Retencion a Proveedor"},
  				{"fieldname":"proveedor", "fieldtype":"Link", "label":__("Proveedor 1"),
  					'label':"Proveedor", 'reqd': 1, "default":frm.doc.supplier},
          {"fieldname":"efectivo", "fieldtype":"Check", "label":__("Check"),
            'label':"Efectivo", "default": 1},
          {"fieldname":"fecha_retencion","fieldtype":"Date",'label':"Fecha de Retención",
            'reqd': 1,"default":frappe.datetime.nowdate()},
          {"fieldname":"numero_factura", "fieldtype":"Data", "label":__("Número de Factura"),
            'label':"Número de Factura", 'reqd': 1,"default": ultima},
          {"fieldname":"coulmn_break","fieldtype":"Column Break"},
          {"fieldname":"referencia", "fieldtype": "Link", "label":__("Referencia"),
            'label':"Referencia", 'reqd': 1, "default": num_factura },
          {"fieldname":"moneda","fieldtype":"Link","label":__("Moneda"),'label':"Moneda",
            'options': "Currency", "default":"USD"},
          {"fieldname":"section_break_1","fieldtype":"Section Break", 'label':"Impuestos"},
          {"fieldname":"iva","fieldtype":"Link","label":__("IVA"),
            'label':"IVA", 'options': "Impuesto", "default": iva},
          {"fieldname":"impuesto_fuente","fieldtype":"Link","label":__("Impuesto Fuente"),
              'label':"Impuesto Fuente", 'options': "Impuesto", "default": impuesto_fuente },
          {"fieldname":"coulmn_break_2","fieldtype":"Column Break"},
          {"fieldname":"ret_iva","fieldtype":"Currency","label":__("Valor Iva"),
            'label':"Valor Retención IVA", 'reqd': 1, "default": ret_iva},
          {"fieldname":"ret_imp","fieldtype":"Currency","label":__("Valor Impuesto Fuente"),
            'label':"Valor Retención Impuesto Fuente", 'reqd': 1, "default": ret_imp},
          {"fieldname":"section_break","fieldtype":"Section Break"},
          {"fieldname":"blank_data","fieldtype":"Read Only"},
          {"fieldname":"coulmn_break_1","fieldtype":"Column Break"},
          {"fieldname":"base_imponible","fieldtype":"Currency","label":__("Base Imponible"),
            'label':"Valor Base Imponible", 'reqd': 1, "default": frm.doc.base_imponible},
          {"fieldname":"impuesto","fieldtype":"Currency","label":__("Impuesto"),
            'label':"Valor Impuesto", 'reqd': 1, "default": frm.doc.impuesto},
          {"fieldname":"total_retencion","fieldtype":"Currency","label":__("Total Retención"),
            'label':"Total Retención", 'reqd': 1, "default": total_ret},
          {"fieldname":"section_break_2","fieldtype":"Section Break"},
  				{'fieldname':"confirm1", "label":__("Verificar Valóres"), "fieldtype":"Button"},
           {'fieldname':"confirm", "label":__("Guardar Retenciión"), "fieldtype":"Button"}]
     });

     //calcular total disminuido con la retencion
     var total_pago="";
     total_pago=totalfact - total_ret;
    //  fechas=values["fecha_retencion"];

  d.fields_dict.ht.$wrapper.html('');
  d.show();

  d.get_input("confirm1").on("click",function(){
    var q = d.get_values();
    var w = d.get_values();
    if (!q) return;
    if (!w) return;
    var a=q["iva"];
    var e=w["impuesto_fuente"];
    var n=a;
    //calculo de nuevo iva e impuesto modificado
         frappe.db.get_value("Impuesto", {"imp_name": a}, "percentage", function (r){
          var porc_iva1 = r.percentage;
             ret_iva1 = impuesto * (porc_iva1/100);
             ret_iva=ret_iva1;
             d.set_value("ret_iva",ret_iva);

     })

     frappe.db.get_value("Impuesto", {"imp_name": e}, "percentage",function(r){
       var porc_imp1 = r.percentage;
         ret_imp1 = base_imp * (porc_imp1/100);
         var total_ret1 = ret_iva1 + ret_imp1;
         total_ret=total_ret1;
         d.set_value("ret_imp",ret_imp1);
         d.set_value("total_retencion",total_ret);
     })
  });

	d.get_input("confirm").on("click", function() {
			var values = d.get_values();
			if(!values) return;
			//if(values["referencia"] == "001-001-" ) frappe.throw("Ingrese el número de referencia de la orden de compra");
      if(values["proveedor"] != frm.doc.supplier ) frappe.throw("No coinciden los datos del nombre del proveedor");
			if(values["base_imponible"] != frm.doc.base_imponible) frappe.throw("El valor de base imponible debe ser el mismo que el de la orden de compra");
      if(values["impuesto"] != frm.doc.impuesto) frappe.throw("El valor de impuestos debe ser el mismo que el de la orden de compra");
      var suma = values["ret_iva"] + values["ret_imp"];
      if(suma != total_ret) frappe.throw("No coincide el valor de las retenciones... verifique nuevamente");

      //guardado de nueva retencion
      return frappe.call({
        "method": "nodux_sales_invoice.purchase_invoice.verifica",
        args:{
          num:num_factura
        },
        callback: function(r) {
          if (r.message) {
            alert("ESTA FACTURA YA TIENE UNA RETENCION")
          }
          else {
            //GENERAR RETENCION
            frappe.call({
              "method": "nodux_sales_invoice.purchase_invoice.update_taxes",
              args: {
                   nombre:cab,
                   pagarto: total_pago,
                   refern: values["referencia"],
                   numero: values["numero_factura"],
                   provedor: values["proveedor"],
                   fecha:values["fecha_retencion"],
                   iva1:values["iva"],
                   impuesto1:values["impuesto_fuente"],
                   base1:values["base_imponible"],
                   valor:values["impuesto"],
                   ret_iva2:values["ret_iva"],
                   ret_imp2:values["ret_imp"],
                   tot:values["total_retencion"]
              },
              callback: function(r) {
                // alert(r.message);
                alert("se ha Generado Retencion con Exito");
              }
            })
            frappe.call({
              "method": "nodux_sales_invoice.purchase_invoice.verifica1",
              args: {
                num14:values["ret_iva"],
                num15:values["ret_imp"],
                nombre1:num_factura,
                fech:values["fecha_retencion"],
                totalrect:(values["total_retencion"]),
                total_fact:(totalfact),
                prove:values["proveedor"]
              },
              callback: function(r) {
              }
            })
           }
        }
       })
		});
		d.show();
    frm.refresh_fields();
    frm.refresh();
  }
});
