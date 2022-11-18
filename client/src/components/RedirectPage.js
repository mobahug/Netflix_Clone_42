import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RedirectPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const user = useSelector(state => state.user)

	useEffect(() => {
		const redirectPages = ['/login', '/signup', '/login/resetpassword', '/oauth', "/"]

		if (user !== null) {
			if (user === '' ) {
				if (!redirectPages.includes(location.pathname) && location.pathname.includes('resetpassword') === false) {
					navigate('/')
				}
			} else {
				if (redirectPages.includes(location.pathname)) {
					navigate('/browsing')
				}
			}
		}
	}, [location, navigate, user])
}

export default RedirectPage
