import React,{Fragment, useEffect} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Spinner from '../layout/Spinner'
import { deleteAccount, getCurrentProfile } from '../../actions/profile'
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from './Education'

const Dashboard = ({ getCurrentProfile,deleteAccount, auth: { isAuthenticated,user}, profile:{loading,profile} }) => {

    useEffect(() => {
        getCurrentProfile()
    },[getCurrentProfile])
    
    return loading && profile === null ? (<Spinner />) : (
        <Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead">
            <i className="fas fa-user" />Welcome {user && user.name}</p>
                {
                    profile !== null ?
                    (<Fragment>
                        <DashboardActions />
                        {profile.experience.length > 0 && <Experience experience={profile.experience} />}
                        {profile.education.length > 0 && <Education education={profile.education} />}
                        <div className="my-2">
                            <button onClick={()=>deleteAccount()} className="btn btn-danger">
                                <i className="fas fa-user-minus"></i>
                                {' '}Delete My Account
                            </button>
                        </div>
                    </Fragment>)
                        :    
                    (<Fragment><p>You have not setup a profile, please create your profile</p>
                    <Link to='/create-profile' className='btn btn-primary my-1'> Create Profile </Link>
                    </Fragment>)
                }
            
        </Fragment>
    )
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile,
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
})

export default connect(mapStateToProps,{getCurrentProfile,deleteAccount})(Dashboard)
