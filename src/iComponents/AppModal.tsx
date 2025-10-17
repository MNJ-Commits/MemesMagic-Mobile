import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import RNModal from 'react-native-modal';

type AppModalProps = {
  isVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  [x: string]: any;
};
export const AppModal = ({
  isVisible = false,
  setModalVisible,
  children,
  ...props
}: AppModalProps) => {
  return (
    <RNModal
      isVisible={isVisible}
      onBackdropPress={() => setModalVisible(false)}
      animationInTiming={1000}
      animationOutTiming={1000}
      backdropTransitionInTiming={800}
      backdropTransitionOutTiming={800}
      {...props}>
      {children}
    </RNModal>
  );
};

const ModalContainer = ({children}: {children: React.ReactNode}) => (
  <View style={styles.container}>{children}</View>
);

const ModalHeader = ({title, ratio}: {title: string; ratio: number}) => (
  <View style={[styles.header, {marginTop: 20 * ratio}]}>
    <Text style={[styles.text, {marginTop: 10 * ratio, fontSize: 24 * ratio}]}>
      {title}
    </Text>
  </View>
);

const ModalBody = ({
  children,
  ratio,
}: {
  children?: React.ReactNode;
  ratio: number;
}) => (
  <View
    style={[
      styles.body,
      {
        paddingHorizontal: 15 * ratio,
        minHeight: 50 * ratio,
        marginTop: 20 * ratio,
      },
    ]}>
    {children}
  </View>
);

const ModalFooter = ({children}: {children?: React.ReactNode}) => (
  <View style={styles.footer}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#25282D',
    borderRadius: 25,
    marginBottom: 30,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: 'Lucita-Regular',
  },
  body: {
    justifyContent: 'center',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
  },
});

AppModal.Header = ModalHeader;
AppModal.Container = ModalContainer;
AppModal.Body = ModalBody;
AppModal.Footer = ModalFooter;
