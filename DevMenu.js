//
// DevMenu.js
//

import React from 'react';
import { NativeModules, View, TouchableHighlight, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 2,
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 12,
    color: 'white',
  },
});

const DevMenu = () => {

  const [liveReloadEnabled, setLiveReloadEnabled] = React.useState<Boolean>(false)
  const [remoteDebuggingEnabled, setRemoteDebuggingEnabled] = React.useState<Boolean>(false)

  // onToggleRemoteDebugging = () => {
  //   NativeModules.DevSettings.setIsDebuggingRemotely(!remoteDebuggingEnabled);
  //   setRemoteDebuggingEnabled(!remoteDebuggingEnabled)
  // }

  // onToggleLiveReload = () => {
  //   NativeModules.DevSettings.setLiveReloadEnabled(!liveReloadEnabled);
  //   setLiveReloadEnabled(!liveReloadEnabled)
  // }


    return (
      <View style={styles.wrapper}>
        {/* <TouchableHighlight style={styles.button} onPress={onToggleRemoteDebugging}>
          <Text style={styles.buttonText}>
            {remoteDebuggingEnabled ? 'Disable' : 'Enable'} Remote Debugging
          </Text>
        </TouchableHighlight> */}

        <TouchableHighlight style={styles.button} onPress={()=> DevSettings.reload()}>
          <Text style={styles.buttonText}>
            {/* {liveReloadEnabled ? 'Disable' : 'Enable'}  */}
            Live Reload
          </Text>
        </TouchableHighlight>
      </View>
    );
  
}

export default DevMenu;
