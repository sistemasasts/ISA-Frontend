
import LoginService from './LoginService';
import QualityService from './QualityService';

export async function SendPostRequestToService(WebRequest, addFunction, typeTx) {

    debugger
    if (WebRequest.parameters != null) {

        WebRequest.parameters = JSON.stringify(WebRequest.parameters);
    }

    let result = null;
    if(typeTx === 'TxCore')
        result = await LoginService.post(WebRequest);
    
    if(typeTx === 'TxQuality')
        result = await QualityService.post(WebRequest);

    
   return  SuccessServiceCall(result, addFunction);

}

function SuccessServiceCall(data, addFunction) {
   
    try {
        var responseClaro = undefined;
        var messageObj = data.message;
        var status= data.status;

        if (data.parameters != null) {
            responseClaro = JSON.parse(data.parameters);
           
        } else {
            responseClaro = { message: '', status: '' }
            responseClaro.message = data.message;
            responseClaro.status = data.status;
        }

      
        if (addFunction) {
            addFunction(responseClaro,status,messageObj)
           
        }

    } catch (error) {
        console.log(error);
    }
}
