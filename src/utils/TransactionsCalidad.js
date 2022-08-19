import { SendPostRequestToService } from "../service/comunication-handler";


var Transactions = {
    LoginValidate: { transactionName: 'loginValidate', transactioncode: 'TR001', parameters: { userName: '', pass: '' }, },
    GetAllProducts: { transactionName: "GetAllProducts", transactionCode: "TxQQRgetProducts", parameters: {} },
    GetProductByID: { transactionName: "GetProductById", transactionCode: "TxQQRgetProductById", parameters: { "idProduct": '' } },
    ProductSave: { transactionName: 'PRODUCTSAVE', transactionCode: 'TxQQRsetProduct', parameters: { typeProduct: '', itcdq: 'IT-CDQ-03.12', nameProduct: '', sapCode: '', descProduct: '' } },
    PropertyProductSave: { transactionName: "SetProduct", transactionCode: "TxQQRsetProduct", parameters: {} },
    GenerateHCC: { transactionName: 'GenerateHcc', transactionCode: 'TxQQRgenerateHCC', parameters: { product: { idProduct: '' }, hcchBatch: '', periodicity: '' } },
    HCCSave: { transactionName: "Create/UpdateHcc", transactionCode: "TxQQRsetHCC", parameters: {} },
    CertificateGenerate: { transactionName: "GenerateQualityCertificate", transactionCode: "TxGQC", parameters: {} },
    ObtenerDataProducto: {},
    GetCatalogsPNC: { transactionName: "Request", transactionCode: "TxRNCP", parameters: "" },
    GetAllHCC: { transactionName: "GetAllHCC_TP", transactionCode: "TxQQRgetHCCTP", parameters: null },
    GetAllPNC: { transactionName: "GetAllNCP", transactionCode: "TxQQRgeAlltNCP", parameters: {} },
    PNCSave: { transactionName: "SetNCP", transactionCode: "TxQQRsetNCP", parameters: {} },
    SaveExitMaterialHistory: { transactionName: "SaveExitMaterial", transactionCode: "TxQQRsaveExitMaterial", parameters: {} },
    ClosePNC: { transactionName: "Close NCP", transactionCode: "TxQQRcloseNCP", parameters: { idNCP: 0 } },
    GetAllClients: { transactionName: "GetAllClients", transactionCode: "TxQQRGAC", parameters: null },
    SaveTest: { transactionName: "SaveTest", transactionCode: "TxQQRsaveTest", parameters: {} },
    GetOnlyPropertyByIdProductAndIdProperty: { transactionName: "GetProductByIdAndPropertyId", transactionCode: "TxQQRgetProductByIdAndPropertyId", parameters: {} },
    GetProductPropertiesByIdProduct: { transactionName: "GetProductPropertiesById", transactionCode: "TxQQRgetProductPropertiesById", parameters: {} },
    GetTestsByIdProductBatchNull: { transactionName: "GetTestByBatchNull", transactionCode: "TxQQRgetTestByBatchNull", parameters: {} },
    SendEmail: { transactionName: "SendEmail", transactionCode: "TxQQRsendEmail", parameters: {} },
    ReadTestPlaneFile: { transactionName: "ReadTestPF", transactionCode: "TxQQRReadTestPF", parameters: {} },
    GetTestByBatchAndIdProduct: { transactionName: "GetTestByBatchAndIdProduct", transactionCode: "TxQQRgetTestByBatchAndIdProduct", parameters: {} },
    SaveComplaintMP: { transactionName: "SaveComplaint", transactionCode: "TxQQRsaveComplaint", parameters: {} },
    GetAllComplaint: { transactionName: "GetAllComplaint", transactionCode: "TxQQRgetAllComplaint", parameters: {} },
    SaveProblem: { transactionName: "SaveProblem", transactionCode: "TxQQRsaveProblem", parameters: {} },
    GenerateReportComplaint: { transactionName: "GenerateReportComplaint", transactionCode: "TxQQRgenerateReportComplaint", parameters: {} },
    GetAllProviders: { transactionName: "GetAllProviders", transactionCode: "TxQQRgetAllProviders", parameters: {} },
    SaveProcessStart: { transactionName: "SetProcessFlow", transactionCode: "TxQQRsetProcessFlow", parameters: {} },
    GetNotificationsProcess: { transactionName: "GetTrayProcess", transactionCode: "TxQQRgetTrayProcess", parameters: {} },
    DowloadFileS: { transactionName: "DownloadFile", transactionCode: "TxQQRDownloadFile", parameters: {} },
    ValidateDeliverMaterial: { transactionName: "ValidateDeliverMaterial", transactionCode: "TxQQRvalidateDeliverMaterial", parameters: {} },
    RespondProcessFlow: { transactionName: "ReplyProcessFlow", transactionCode: "TxQQRReplyProcessFlow", parameters: {} },
    GenerateReportDDP04: { transactionName: "GenerateReportProcessTestRequest", transactionCode: "TxQQRgenerateReportProcessTestRequest", parameters: {} },
    OrderMP: { transactionName: "OrderMP", transactionCode: "TxQQROrderMP", parameters: {} },
    AvailableMP: { transactionName: "AvailableMP", transactionCode: "TxQQRAvailableMP", parameters: {} },
    GenerateDataReport: { transactionName: "GenerateDataReport", transactionCode: "TxQQRgenerateDataReport", parameters: {} },

}

export function productSave(producto, addFunction) {
    debugger;
    var transaction = Transactions.ProductSave;
    transaction.parameters = { typeProduct: '', itcdq: 'IT-CDQ-03.12', nameProduct: '', sapCode: '', descProduct: '' };
    transaction.parameters.descProduct = '';
    transaction.parameters.nameProduct = '';
    transaction.parameters.typeProduct = '';
    transaction.parameters.sapCode = '';
    transaction.parameters.typeProduct = producto.typeProduct;
    transaction.parameters.nameProduct = producto.nameProduct;
    transaction.parameters.sapCode = producto.sapCode;
    transaction.parameters.descProduct = producto.descProduct;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function GetAllProducts(addFunction) {
    var transaction = Transactions.GetAllProducts;
    transaction.parameters = {};
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function GetProductById(id, addFunction) {
    try {
        debugger;
        var transaction = Transactions.GetProductByID;
        transaction.parameters = { "idProduct": '' };
        transaction.parameters.idProduct = id;
        SendPostRequestToService(transaction, addFunction, 'TxQuality');
    } catch (e) {
        console.log(e);
    }
};

export function PropertyProductSave(product, addFunction) {
    var transaction = Transactions.PropertyProductSave;
    transaction.parameters = {};
    transaction.parameters = product;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GenerateHCC(idProduct, hccBatch, periodicity, addFunction) {
    debugger;
    var transaction = Transactions.GenerateHCC;
    transaction.parameters = { product: { idProduct: '' }, hcchBatch: '', periodicity: '' };
    transaction.parameters.product.idProduct = idProduct;
    transaction.parameters.hcchBatch = hccBatch;
    transaction.parameters.periodicity = periodicity;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function HCCSave(hcc, addFunction) {
    var transaction = Transactions.HCCSave;
    transaction.parameters = {};
    transaction.parameters = hcc;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GetCatalogsPNC(addFunction) {
    debugger;
    var transaction = Transactions.GetCatalogsPNC;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GetAllHCCs(addFunction) {
    var transaction = Transactions.GetAllHCC;
    transaction.parameters = null;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GetAllPncs(addFunction) {
    var transaction = Transactions.GetAllPNC;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function PNCSave(pnc, addFunction) {
    var transaction = Transactions.PNCSave;
    transaction.parameters = {};
    transaction.parameters = pnc;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function ClosedPNC(idPNC, addFunction) {
    var transaction = Transactions.ClosePNC;
    transaction.parameters = { idNCP: 0 };
    transaction.parameters.idNCP = idPNC;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function SaveExitMaterialHistory(data, addFunction) {
    var transaction = Transactions.SaveExitMaterialHistory;
    transaction.parameters = { };
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GenerateCertificate(data, addFunction, ) {
    debugger
    var transaction = Transactions.CertificateGenerate;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GetAllClients(addFunction) {
    var transaction = Transactions.GetAllClients;
    transaction.parameters = {};
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function SaveTest(data, addFunction) {
    var transaction = Transactions.SaveTest;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');

}

export function GetOnlyPropertyByIdProductAndIdProperty(data, addFunction) {
    var transaction = Transactions.GetOnlyPropertyByIdProductAndIdProperty;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GetProductPropertiesByIdProduct(data, addFunction) {
    var transaction = Transactions.GetProductPropertiesByIdProduct;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GetTestByProductIDByBatchNull(data, addFunction) {
    var transaction = Transactions.GetTestsByIdProductBatchNull;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function SendEmail(data, addFunction) {
    var transaction = Transactions.SendEmail;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function ReadTestPlaneFile(data, addFunction) {
    var transaction = Transactions.ReadTestPlaneFile;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GetTestBatchAndIpProduct(data, addFunction) {
    var transaction = Transactions.GetTestByBatchAndIdProduct;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function SaveComplaintRMP(data, addFunction) {
    var transaction = Transactions.SaveComplaintMP;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GetAllComplaintsRMP(addFunction) {
    var transaction = Transactions.GetAllComplaint;
    transaction.parameters = {};
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function SaveProblemRMP(data, addFunction) {
    var transaction = Transactions.SaveProblem;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GenerateReportComplaint(data, addFunction) {
    var transaction = Transactions.GenerateReportComplaint;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
}

export function GetAllProviders(addFunction) {
    var transaction = Transactions.GetAllProviders;
    transaction.parameters = {};
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function SaveProcessStart(data, addFunction) {
    var transaction = Transactions.SaveProcessStart;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function GetNotifications(data, addFunction) {
    var transaction = Transactions.GetNotificationsProcess;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function DownloadFileFromServer(data, addFunction) {
    var transaction = Transactions.DowloadFileS;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function ValidateDeliverMaterial(data, addFunction) {
    var transaction = Transactions.ValidateDeliverMaterial;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function RespondProcessFlow(data, addFunction) {
    var transaction = Transactions.RespondProcessFlow;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function GenerateReportDDP04(data, addFunction) {
    var transaction = Transactions.GenerateReportDDP04;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function TxOrderMP(data, addFunction) {
    var transaction = Transactions.OrderMP;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function TxAvailableMP(data, addFunction) {
    var transaction = Transactions.AvailableMP;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};

export function GenerateDataReport(data, addFunction) {
    var transaction = Transactions.GenerateDataReport;
    transaction.parameters = {};
    transaction.parameters = data;
    SendPostRequestToService(transaction, addFunction, 'TxQuality');
};