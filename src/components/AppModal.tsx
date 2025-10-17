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

const ModalHeader = ({title}: {title: string}) => (
  <View style={styles.header}>
    <Text style={styles.text}>{title}</Text>
  </View>
);

const ModalBody = ({children}: {children?: React.ReactNode}) => (
  <View style={styles.body}>{children}</View>
);

const ModalFooter = ({children}: {children?: React.ReactNode}) => (
  <View style={styles.footer}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#25282D',
    borderRadius: 25,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  text: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'Lucita-Regular',
  },
  body: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    minHeight: 100,
    marginTop: 20,
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
