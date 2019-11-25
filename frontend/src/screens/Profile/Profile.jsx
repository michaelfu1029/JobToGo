import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Logger from 'js-logger';
import axios from 'axios';
import { GoogleSignin } from 'react-native-google-signin';

import ErrorDisplay from '../../components/ErrorDisplay';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import NavHeader from '../../components/NavHeader/NavHeader';
import config from '../../constants/config';
import { errors } from '../../constants/messages';
import styles from './styles';
import { colours } from '../../styles';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      email: '',
      loading: true,
      showErrorDisplay: false,
      errorDisplayText: errors.default,
    };
    this.logger = Logger.get(this.constructor.name);
  }

  async componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('willFocus', () => this.fetchAccountInfo());
  }

  fetchAccountInfo = async () => {
    const { userId } = global;
    try {
      const ret = await axios.get(`${config.ENDP_USER_INFO}${userId}`);
      const { userName, email } = ret.data.result.credentials;
      this.setState({ userName, email, loading: false });
    } catch (e) {
      this.setState({
        loading: false,
        showErrorDisplay: true,
        errorDisplayText: !e.response ? errors.default : e.response.data.errorMessage,
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const {
      userName, email, loading, showErrorDisplay, errorDisplayText,
    } = this.state;

    if (loading) return <Loader />;
    return (
      <View style={styles.container}>
        <NavHeader
          title="Account"
          leftButtonOption="back"
          onPressLeftButton={() => navigation.navigate('TabStack')}
        />
        <ErrorDisplay
          showDisplay={showErrorDisplay}
          setShowDisplay={show => this.setState({ showErrorDisplay: show })}
          displayText={errorDisplayText}
        />
        <Text style={styles.text}>
          {userName}
        </Text>
        <Text style={styles.text}>
          {email}
        </Text>
        <Button
          backgroundColor={colours.accentPrimary}
          title="Update Username"
          textColor={colours.white}
          style={styles.button}
          onPress={() => navigation.navigate('UpdateUserName')}
        />
        <Button
          backgroundColor={colours.accentPrimary}
          title="Update Password"
          textColor={colours.white}
          style={styles.button}
          onPress={() => navigation.navigate('UpdatePassword')}
        />
        <Text style={styles.text}>
          Change your account settings
        </Text>
        <Button
          backgroundColor={colours.accentPrimary}
          title="Update Keywords"
          textColor={colours.white}
          style={styles.button}
          onPress={() => navigation.navigate('KeywordList')}
        />
        <Button
          backgroundColor={colours.accentPrimary}
          title="Log Out"
          textColor={colours.white}
          style={styles.button}
          onPress={async () => { await GoogleSignin.signOut(); navigation.navigate('Auth'); }}
        />
      </View>
    );
  }
}
