import React, { Component } from "react";
import {View, Text, Image, TouchableOpacity, I18nManager, FlatList, Platform, Dimensions, ImageBackground, Animated,} from "react-native";
import {
    Container,
    Content,
    Icon,
    Header,
    List,
    ListItem,
    Left,
    Button,
    Item,
    Input,
    Right,
    CheckBox,
    Form
} from 'native-base'
import styles from '../../assets/styles'
import i18n from '../../locale/i18n'
import COLORS from '../../src/consts/colors'
import { DoubleBounce } from 'react-native-loader';
import {getRules} from '../actions'
import * as Animatable from 'react-native-animatable';
import {connect} from "react-redux";



const height = Dimensions.get('window').height;
const IS_IPHONE_X = height === 812 || height === 896;


class Rules extends Component {
    constructor(props){
        super(props);

        this.state={
            status: null,
            backgroundColor: new Animated.Value(0),
            availabel: 0,
            value:0,
        }
    }




    setAnimate(availabel){
        if (availabel === 0){
            Animated.timing(
                this.state.backgroundColor,
                {
                    toValue: 1,
                    duration: 1000,
                },
            ).start();
            this.setState({ availabel: 1 });
        }else {
            Animated.timing(
                this.state.backgroundColor,
                {
                    toValue: 0,
                    duration: 1000,
                },
            ).start();
            this.setState({ availabel: 0 });
        }

        console.log(availabel);
    }

    headerScrollingAnimation(e){
        if (e.nativeEvent.contentOffset.y > 30){
            console.log(e.nativeEvent.contentOffset.y);
            this.setAnimate(0)
        } else{
            this.setAnimate(1)
        }
    }

    componentWillMount() {
        this.props.getRules( this.props.lang )
    }

    renderLoader(){
        if (this.props.loader){
            return(
                <View style={{ alignItems: 'center', justifyContent: 'center', height: height , alignSelf:'center' , backgroundColor:'#fff' , width:'100%' , position:'absolute' , zIndex:1  }}>
                    <DoubleBounce size={20} color={COLORS.labelBackground} />
                </View>
            );
        }
    }

    render() {

        const backgroundColor = this.state.backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0)', '#00000099']
        });
        return (
            <Container>
                <Header style={[styles.header , styles.plateformMarginTop]} noShadow>
                    <Animated.View style={[styles.headerView  , styles.animatedHeader ,{ backgroundColor: backgroundColor}]}>
                        <Right style={styles.flex0}>
                            <Button transparent onPress={() => this.props.navigation.goBack()} style={styles.headerBtn}>
                                <Icon type={'FontAwesome'} name={'angle-right'} style={[styles.transform, styles.rightHeaderIcon]} />
                            </Button>
                        </Right>
                        <Text style={[styles.headerText , styles.headerTitle]}>{ i18n.t('terms') }</Text>
                        <Left style={styles.flex0}/>
                    </Animated.View>
                </Header>
                <Content  contentContainerStyle={styles.flexGrow} style={[styles.homecontent ]}  onScroll={e => this.headerScrollingAnimation(e) }>
                    { this.renderLoader() }
                    <ImageBackground source={require('../../assets/images/rules_bg.png')} resizeMode={'cover'} style={styles.imageBackground}>
                        <View style={[styles.curvedImg]}>
                            <Image source={require('../../assets/images/rules_pic.png')} style={[styles.headImg , styles.bBLR0]} resizeMode={'cover'} />
                            <View style={styles.overBg}/>
                        </View>
                        <View style={styles.p20}>
                            <Animatable.View animation="fadeInUp" duration={1000} style={styles.mb10}>
                                {/*<Text style={[styles.termsText , styles.aSFS , {color:COLORS.boldgray , fontSize:14,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>البند الأول</Text>*/}
                                <Text style={[styles.type ,{color:COLORS.mediumgray ,  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>  { this.props.rules } </Text>
                            </Animatable.View>
                        </View>
                        <Animatable.View animation="fadeInUp" duration={1000} style={[ styles.directionRow , styles.ml15]}>
                            <CheckBox checked={true} color={COLORS.labelBackground} style={[ styles.mr20 , styles.pr2 ,{backgroundColor:COLORS.labelBackground}]} />
                            <Text style={[styles.agreeText , {color:COLORS.mediumgray}]}>{ i18n.t('agreeTo') } <Text  style={styles.termsText}>{ i18n.t('terms') }</Text></Text>
                        </Animatable.View>
                    </ImageBackground>
                </Content>
            </Container>

        );
    }
}

const mapStateToProps = ({ lang , rules }) => {
    return {
        lang: lang.lang,
        rules: rules.rules,
        loader: rules.loader
    };
};
export default connect(mapStateToProps, {getRules})(Rules);