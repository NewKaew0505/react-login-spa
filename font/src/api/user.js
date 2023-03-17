import axios from 'axios';


export const apiInstance = () => {
  const user = localStorage.getItem('user')
  const getUser = JSON.parse(user)
  const authorization = getUser?.user?.jwt ? `bearer ${getUser?.user?.jwt}` : null

  const headers = {
    'authorization': authorization ? authorization : '',
  }

  return axios.create({
    baseURL: `${process.env.REACT_APP_API}`,
    headers,
  })
}

export const  register =( data) => {
    return apiInstance().post(`register`, data)
    .then(function (response) {
      return response
    })
    .catch(function (error) {
      console.log(error);
      return error
    })
}

export const  login =( data) => {
  return apiInstance().post(`${process.env.REACT_APP_API}/login`, data)
  .then(function (response) {
    return response
  })
  .catch(function (error) {
    console.log(error);
    return error
  })
}

export const  edit =( data) => {
  return apiInstance().put(`${process.env.REACT_APP_API}/update`, data)
  .then(function (response) {
    return response
  })
  .catch(function (error) {
    console.log(error);
    return error
  })
}
