import { SendPostRequestToService } from "../service/comunication-handler";




var TransactionsCore = {
    LoginValidate: { transactionName: "AAS", transactionCode: "TxAAS", parameters: { userName: '', pass: '' }, },
    ActaSave: { transactionName: 'actaSave', transactioncode: 'TR002', parameters: {} },
    GetAllProperty: { transactionName: 'GetAllOnlyPL', transactionCode: 'TxQQRgetOnlyPL', parameters: {} }
}

export async  function loginValidate(user, password, addFunction) {
    debugger;
    var transaction = TransactionsCore.LoginValidate;
    transaction.parameters= { userName: '', pass: '' };
    transaction.parameters.userName = user;
    transaction.parameters.pass = password;
    SendPostRequestToService(transaction,addFunction,'TxCore');
}


