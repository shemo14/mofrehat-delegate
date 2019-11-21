import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, ScrollView, Dimensions , I18nManager} from "react-native";
import i18n from "../../locale/i18n";
import styles from "../../assets/styles";
import COLORS from "../consts/colors";
import {connect} from "react-redux";
import {logout, tempAuth} from "../actions";

const height = Dimensions.get('window').height;
class DrawerCustomization extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }

    tabEvent(tabName){
        if (tabName == 'login'){
            this.props.logout(this.props.user.token);
            this.props.tempAuth();
        }

        this.props.onClose();
        this.props.navigation.navigate(tabName)
    }

    renderMenuTabs(tabName){
        // is Active
        if (this.props.routeName === tabName){
            let activePath = '';
            let activeText = '';

            switch (tabName) {
                case 'myOrders':
                    activePath = require('../../assets/images/home.png');
                    activeText =  i18n.t('myOrders') ;
                    break;
                case 'aboutApp':
                    activePath = require('../../assets/images/conversation_blue.png');
                    activeText =  i18n.t('aboutApp') ;
                    break;
                case 'complaints':
                    activePath = require('../../assets/images/customer_service_blue.png');
                    activeText =  i18n.t('complaints') ;
                    break;
                case 'contactUs':
                    activePath = require('../../assets/images/contact_blue.png');
                    activeText =  i18n.t('contactUs') ;
                    break;
                case 'settings':
                    activePath = require('../../assets/images/settings_blue.png');
                    activeText =  i18n.t('settings') ;
                    break;
                case 'rules':
                    activePath = require('../../assets/images/law_blue.png');
                    activeText =  i18n.t('terms') ;
                    break;
                case 'login':
                    activePath = require('../../assets/images/sign_out_blue.png');
                    activeText =  i18n.t('logout') ;
                    break;
            }

            return(
                <TouchableOpacity style={styles.activeLink}>
                    <Image style={[styles.menuImg, styles.transform]} resizeMode={'contain'} source={activePath}/>
                    <Text style={[styles.type ,{color:COLORS.labelBackground}]}>{activeText}</Text>
                </TouchableOpacity>
            );
        }


        let path = '';
        let disabledText =''
        switch (tabName) {
            case 'myOrders': path = require('../../assets/images/package.png');
                disabledText =  i18n.t('myOrders') ;
                break;
            case 'aboutApp': path = require('../../assets/images/conversation.png');
                disabledText =  i18n.t('aboutApp') ;
                break;
            case 'complaints': path = require('../../assets/images/customer_service.png');
                disabledText =  i18n.t('complaints') ;
                break;
            case 'contactUs': path = require('../../assets/images/contact.png');
                disabledText =  i18n.t('contactUs') ;
                break;
            case 'settings': path = require('../../assets/images/settings.png');
                disabledText =  i18n.t('settings') ;
                break;
            case 'rules': path = require('../../assets/images/law.png');
                disabledText =  i18n.t('terms') ;
                break;
            case 'login': path = require('../../assets/images/sign_out.png');
                disabledText =  i18n.t('logout') ;
                break;
        }
        return(

            <TouchableOpacity style={styles.disabledLink} onPress={() => this.tabEvent(tabName)} >
                <Image style={[styles.menuImg, styles.transform]} resizeMode={'contain'} source={path}/>
                <Text style={[styles.type ,{color:COLORS.mediumgray}]}>{disabledText}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={[styles.drawerParent]}>
                <TouchableOpacity onPress={() => [this.props.navigation.navigate('profile') , this.props.onClose()]} style={styles.directionRowCenter}>
                    <View style={styles.mandob}>
                        <Image source={{ uri: this.props.user.avatar }} style={[styles.profileImg , {height:50}]} resizeMode={'cover'} />
                    </View>
                    <View style={styles.directionColumn}>
                        <Text style={[styles.ques , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>{ this.props.user.name }</Text>
                        {/*<Text style={[styles.type ,{color:COLORS.mediumgray,writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'  }]}>رقم المركبة س م ع 1234</Text>*/}
                    </View>
                </TouchableOpacity>

                <View style={styles.line}/>
                <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
                    <View style={[styles.drawerParent ]}>


                        {  this.renderMenuTabs('myOrders') }


                        {  this.renderMenuTabs('aboutApp') }


                        {  this.renderMenuTabs('complaints') }


                        {  this.renderMenuTabs('contactUs') }


                        {  this.renderMenuTabs('settings') }


                        {  this.renderMenuTabs('rules') }


                        {  this.renderMenuTabs('login') }
                    </View>
                </ScrollView>
            </View>

        );
    }
}

const mapStateToProps = ({ auth, profile }) => {
    return {
        auth: auth.user,
        user: profile.user
    };
};

export default connect(mapStateToProps, { logout, tempAuth })(DrawerCustomization);