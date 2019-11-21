import { combineReducers }  from 'redux';
import lang                 from './LangReducer';
import auth                 from './AuthReducer';
import profile              from './ProfileReducer';
import aboutApp             from './AboutAppReducer';
import contactUs            from './ContactUsReducer';
import rules                from './RulesReducer';
import myOrders             from './MyOrdersReducer';
import newOrder             from './NewOrderReducer';
import financial            from './FinancialReducer';
import suggestions          from './SuggestionsReducer';
import report               from './ReportReducer';
import city                 from './CityReducer';
import register             from './RegisterReducer';
import finishOrder          from './FinishOrderReducer';


export default combineReducers({
    lang,
    auth,
    profile,
    aboutApp,
    contactUs,
    rules,
    myOrders,
    newOrder,
    financial,
    suggestions,
    report,
	city,
	register,
	finishOrder,
});

