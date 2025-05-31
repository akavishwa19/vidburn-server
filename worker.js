
import { parentPort , workerData } from "worker_threads";

function fib(n){

    if(n==0){
        return 1;
    }
    if(n==1){
        return 1;
    }

    return fib(n-1)+fib(n-2);
}

const fibResult=fib(workerData);

parentPort.postMessage(fibResult)