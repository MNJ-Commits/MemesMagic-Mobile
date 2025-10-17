import React, {memo} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';

const AppPaymentStatusModal = (props: {loading: boolean}) => {
  return (
    <Modal
      animationIn="tada"
      animationOut="tada"
      backdropOpacity={0.6}
      // isVisible={true}
      isVisible={props.loading}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size={'large'} color={'#FF439E'} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default memo(AppPaymentStatusModal);
