import React, { Component } from "react";
import {Animated, AsyncStorage, Dimensions, View} from 'react-native';
import {connect} from "react-redux";
import axios from "axios";
import CONST from "../consts";
import {DoubleBounce} from "react-native-loader";
import COLORS from "../consts/colors";
import {chooseLang} from "../actions";

const height = Dimensions.get('window').height;
class InitScreen extends Component {
    constructor(props) {
        super(props);
		this.state={
			loader: false,
		}
	}

    async componentWillMount() {
        this.setState({ loader: true });
        if (this.props.auth == null || this.props.user == null)
            this.props.navigation.navigate('login')
        else{
			this.props.navigation.navigate('myOrders');
        }

        AsyncStorage.getItem('init').then(init => {
            if (init != 'true'){
                AsyncStorage.setItem('init', 'true');
                this.props.chooseLang('ar');
            }
        })
    }

    render() {
        return false;
    }
}

const mapStateToProps = ({ auth, profile, lang }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang
    };
};
export default connect(mapStateToProps, {chooseLang})(InitScreen);