//Buyer Assets
function profileBuyer(id_user, id_customer, fileName) {
  return `${id_user}/${id_customer}/profile/${fileName}`;
}

//Seller Assets
function servicePhoto(id_user, id_seller, id_service, fileName) {
  return `${id_user}/${id_seller}/service/${id_service}/${fileName}`;
}

function profileSeller(id_user, id_seller, fileName) {
  return `${id_user}/${id_seller}/profile/${fileName}`;
}

function dokumentasiPhoto(id_user, id_seller, id_docs, fileName) {
  return `${id_user}/${id_seller}/documentation/${id_docs}/${fileName}`;
}

export { profileBuyer, servicePhoto, profileSeller, dokumentasiPhoto };
