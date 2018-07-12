import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'react-router-redux';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '../../app/store/configureStore';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from '../../app/styles/theme'

import AddNodeModal from '../../app/components/AddNodeModal';


Enzyme.configure({ adapter: new Adapter() });

function setup(initialState) {
    const store = configureStore(initialState);
    const history = createBrowserHistory();
    const provider = (
        <MuiThemeProvider>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <ThemeProvider theme={Theme}>
                        <div>
                            <AddNodeModal isModalOpen={true}/>
                        </div>
                    </ThemeProvider>
                </ConnectedRouter>
            </Provider>
        </MuiThemeProvider>
    );
    const app = mount(provider);
    return {
        app,
        inputs: app.find('input'),
    };
}

describe('containers', () => {
    describe('App', () => {
        it('inputs count should be equal 3', () => {
            const { inputs } = setup();
            expect(inputs.length).toEqual(3);
        });
    });
});
