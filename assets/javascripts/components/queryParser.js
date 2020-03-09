//TODO Add this as a service rather than a component
const getRawParams = function(){
    params = new URLSearchParams(window.location.search)
    return params
}

const getParamArray = function(params){
    res = []
    params.forEach((p)=>{
        res.push(p.toString())
    })
    return res;
}
