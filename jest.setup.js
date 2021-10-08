import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import 'react-native-mock-render/mock';
import 'react-test-renderer';
// import 'react-native/Libraries/Animated/src/bezier'; // for https://github.com/facebook/jest/issues/4710

Enzyme.configure({ adapter: new Adapter() });