function status(request, response){
  return response.status(200).json({fruta: "Banana"});
}

export default status;