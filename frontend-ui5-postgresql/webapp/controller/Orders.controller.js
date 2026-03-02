sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "../model/models",
    "../api/orders",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, formatter, models, API, Fragment, JSONModel) {
    "use strict";

    var ordModels;

    return Controller.extend("kyma.sample.app.controller.Orders", {
      formatter: formatter,

      onInit: async function () {
        this.setViewModel();
        this.setDataModel();
      },

      setDataModel: async function () {
        const ordModels = models.createOrdersModel();
        const orders = await API.getOrders();
        await ordModels.setData(orders);
        this.getView().setModel(ordModels, "orders");
        this.toggleBusy();
      },

      setViewModel: function () {
        const viewModel = new JSONModel({
          errorMsgTxt: "",
          isMsgStripVisible: false,
          isBusy: true,
        });
        this.getView().setModel(viewModel, "viewModel");
      },

      onAddOrder: async function () {
        const resourceBundle = this.getView().getModel("i18n").getResourceBundle();
        const title = resourceBundle.getText("addOrder");
        const emptyOrdModel = API.getEmptyOrder();

        await this.getFormDialog();
        this._oFormDialog.setModel(emptyOrdModel);
        this._oFormDialog.bindElement("/");
        this._oFormDialog.setTitle(title);
        Fragment.byId("addEditFormFrag", "orderIdTxt").setEditable(true);

        this._oFormDialog.open();
      },

      onShowEdit: async function (oEvent) {
        const oModel = this.getView().getModel("orders");
        const resourceBundle = this.getView().getModel("i18n").getResourceBundle();
        const title = resourceBundle.getText("editOrder");
        const orderPath = oEvent.getSource().getBindingContext("orders").getPath();
        const tempOrdModel = API.getEmptyOrder();

        tempOrdModel.setData(oModel.getProperty(orderPath));

        await this.getFormDialog();
        this._oFormDialog.setModel(tempOrdModel);
        this._oFormDialog.bindElement(orderPath);
        this._oFormDialog.setTitle(title);
        Fragment.byId("addEditFormFrag", "orderIdTxt").setEditable(false);

        this._oFormDialog.open();
      },

      onShowDeleteConfirm: async function (oEvent) {
        var oBundle = this.getView().getModel("i18n").getResourceBundle();
        const oBindingContext = oEvent.getSource().getBindingContext("orders");
        const orderId = oBindingContext.getProperty("order_id");
        var sMsg = oBundle.getText("orderConfirmDelete", [orderId]);

        await this.getConfirmDeleteDialog();
        Fragment.byId("deleteOrderFrag", "confirmDeleteMsg").setText(sMsg);
        this._oDeleteDialog.setBindingContext(oBindingContext);
        this._oDeleteDialog.open();
      },

      saveOrderForm: async function (oEvent) {
        const orderPath = oEvent.getSource().getBindingContext().getPath();
        const data = oEvent.getSource().getModel().getProperty("/");
        const isAddOrder = Fragment.byId("addEditFormFrag", "orderIdTxt").getEditable();

        if (isAddOrder) {
          await this.addOrder(data);
        } else {
          await this.editOrder(data, orderPath);
        }
        this._oFormDialog.close();
      },

      closeDialog: function (oEvent) {
        const dialog = oEvent.getSource().getParent();
        dialog.close();
      },

      toggleBusy: function () {
        const viewModel = this.getView().getModel("viewModel");
        const isBusy = viewModel.getProperty("/isBusy");
        viewModel.setProperty("/isBusy", !isBusy);
      },

      deleteOrder: async function (oEvent) {
        this.toggleBusy();
        try {
          const oBindingContext = oEvent.getSource().getBindingContext();
          const sPath = oBindingContext.getPath();
          const index = sPath.replace("/", "");
          const orderId = oBindingContext.getModel().getProperty(sPath + "/order_id");
          const oModel = this.getView().getModel("orders");
          const orders = oModel.getData();

          await API.deleteOrder(orderId);
          orders.splice(index, 1);
          oModel.setData(orders);
        } catch (err) {
          this.showErrorMsq(err);
          console.log(err);
        }
        this.toggleBusy();
        this._oDeleteDialog.close();
      },

      addOrder: async function (data) {
        this.toggleBusy();
        try {
          const response = await API.addOrder(data);
          const oModel = this.getView().getModel("orders");
          const position = oModel.getData().length;
          oModel.setProperty("/" + position, response[0]);
        } catch (err) {
          this.showErrorMsq(err);
          console.log(err);
        }
        this.toggleBusy();
      },

      editOrder: async function (data, orderPath) {
        this.toggleBusy();
        try {
          await API.updateOrder(data);
          this.getView()
            .getModel("orders")
            .setProperty(orderPath + "/description", data.description);
        } catch (err) {
          this.showErrorMsq(err);
          console.log(err);
        }
        this.toggleBusy();
      },

      showErrorMsq: function (err) {
        const viewModel = this.getView().getModel("viewModel");
        viewModel.setProperty("/errorMsgTxt", err);
        viewModel.setProperty("/isMsgStripVisible", true);
      },

      getFormDialog: async function () {
        if (!this._oFormDialog) {
          this._oFormDialog = await Fragment.load({
            id: "addEditFormFrag",
            name: "kyma.sample.app.view.OrderForm",
            controller: this,
          });
          this.getView().addDependent(this._oFormDialog);
        }
        return this._oFormDialog;
      },

      getConfirmDeleteDialog: async function () {
        if (!this._oDeleteDialog) {
          this._oDeleteDialog = await Fragment.load({
            id: "deleteOrderFrag",
            name: "kyma.sample.app.view.DeleteOrder",
            controller: this,
          });
          this.getView().addDependent(this._oDeleteDialog);
        }
        return this._oDeleteDialog;
      },
    });
  }
);
