import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Animated,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Pro from '../assets/svgs/pro.svg';
import Search from '../assets/svgs/search.svg';
import RightTick from '../assets/svgs/right-tick.svg';
import {RFValue} from 'react-native-responsive-fontsize';
import {useGetCustomTemplates} from '../hooks/useGetCustomTemplates';
import {usePostCustomRenders} from '../hooks/usePostCustomRenders';
import {useFocusEffect} from '@react-navigation/native';
import AppFlatlist from '../components/AppFlatlist';
import {
  loadAppleAccessTokenFromStorage,
  loadVerifyPaymentFromStorage,
  storeAppleAccessToken,
} from '../store/asyncStorage';
import AppPaymentStatusModal from '../components/PaymentStatusModal';

const CustomScreen = ({navigation, route}: any) => {
  const [allGif, setAllGIF] = useState<any>([]);
  const [UIDs, setUIDs] = useState<any>([]);
  const [newUIDs, setNewUIDs] = useState<any>([]);
  const [tag, setTag] = useState<string>('Random');
  const [visibleSearch, setVisibleSearch] = useState<boolean>(false);
  const [loader, setLoader] = useState<Boolean>(true);
  const [refreshLoader, setRefreshLoader] = useState<Boolean>(true); // GIF Loader
  const [showScreen, setShowScreen] = useState<Boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [accessToken, setAccessToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const renderInput: any = useRef<any>('');
  const prevTag: any = useRef<any>('Random');

  const getCustomTemplates: any = useGetCustomTemplates(
    tag,
    page,
    limit,
    accessToken,
    {
      // enabled:false,
      onSuccess: async (res: any) => {
        if (res.length === 0) {
          setLoader(false);
        }
        const uids = res?.map((items: any) => {
          return items.uid;
        });
        setNewUIDs(uids);
        setUIDs([...new Set([...UIDs, ...uids])]);
        if (renderInput.current?.value && getCustomRenders.data) {
          setRefreshLoader(true);
          prevTag.current = tag;

          if (prevTag.current === tag || tag === '') renderRequestChunk(uids);
          else {
            setAllGIF([]);
          }
        } else {
          setAllGIF([...new Set([...allGif, ...res])]);
          setRefreshLoader(false);
        }
      },
      onError: (res: any) => console.log('onError: ', res),
    },
  );

  const getCustomRenders: any = usePostCustomRenders({
    onSuccess(res) {
      if (prevTag.current === tag || tag === '')
        setAllGIF((prevAllGIF: any) => [...prevAllGIF, ...res]);
      else {
        setAllGIF([]);
        prevTag.current = tag;
        renderRequestChunk(newUIDs);
      }
      setTimeout(() => {
        setRefreshLoader(false);
      }, 3000);
    },
    onError(error) {
      console.log('getCustomRenders error: ', error);
    },
  });

  const renderRequestChunk = (uids = UIDs) => {
    let textInput = renderInput?.current?.value;

    setLoader(true);
    // const chunkSize = 2;
    if (
      renderInput?.current?.value &&
      renderInput?.current?.value?.length !== 0
    ) {
      if (uids.length <= 25) {
        getCustomRenders.mutate({
          render_format: 'webp',
          text: [renderInput.current.value],
          uids: uids,
          access_token: accessToken,
        });
      } else {
        for (let i = 0; i <= uids.length - 1; i += 25) {
          setTimeout(() => {
            getCustomRenders.mutate({
              render_format: 'webp',
              text: [renderInput.current.value],
              uids: uids.slice(i, i + 25),
              access_token: accessToken,
            });
          }, i * 200);
        }
      }
    } else {
      //alternatively, update setText on inputRef change
      refresh();
    }
  };

  const refresh = () => {
    setRefreshLoader(true);
    setLoader(true);
    setLimit(25);
    setAllGIF([]);
    setUIDs([]);
    if (
      page > 1 &&
      (!renderInput?.current?.value ||
        renderInput?.current?.value?.length === 0)
    ) {
      setPage(1);
    } else if (
      page > 1 &&
      (renderInput?.current?.value || renderInput?.current?.value?.length !== 0)
    ) {
      setPage(1);
    } else {
      getCustomTemplates.refetch();
    }
  };

  useEffect(() => {
    setRefreshLoader(true);
    setLoader(true);
    if (tag.length != 0 && page == 1) {
      setRefreshLoader(true);
      getCustomTemplates.refetch();
    } else if (
      (!renderInput?.current?.value ||
        renderInput?.current?.value.length === 0) &&
      tag.length != 0 &&
      page > 1
    ) {
      getCustomTemplates.refetch();
    } else if (
      (!renderInput?.current?.value ||
        renderInput?.current?.value.length === 0) &&
      tag.length == 0 &&
      page == 1
    ) {
      setRefreshLoader(true);
      getCustomTemplates.refetch();
    } else if (
      (!renderInput?.current?.value ||
        renderInput?.current?.value.length === 0) &&
      tag.length == 0 &&
      page > 1
    ) {
      getCustomTemplates.refetch();
    } else if (renderInput?.current?.value.length !== 0 && page == 1) {
      getCustomTemplates.refetch();
    } else if (renderInput?.current?.value.length !== 0 && page > 1) {
      setLoader(false); // kept in synch with Banner
      // not rendering on tex
      getCustomTemplates.refetch();
    }

    return () => {};
  }, [page]);

  useEffect(() => {
    setAllGIF([]);
    setUIDs([]);
    setLimit(25);
    setRefreshLoader(true);
    setLoader(true);
    setPage(1);
    if (page === 1) getCustomTemplates.refetch();

    return () => {};
  }, [tag]);

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  Animated.timing(imageOpacity, {
    toValue: 1,
    duration: 1500, // Fade in duration
    useNativeDriver: true,
  }).start(() => {});

  setTimeout(() => {
    setShowScreen(true);
  }, 3000);

  // Get the deep link used to open the app
  const getUrlAsync = async () => {
    await Linking.getInitialURL().then(url => {
      if (url === 'https://memeswork.com')
        navigation.navigate('SubscriptionScreen', {
          returnScreen: 'CustomScreen',
        });
    });

    Linking.addEventListener('url', url => {
      if (url?.url === 'https://memeswork.com')
        navigation.navigate('SubscriptionScreen', {
          returnScreen: 'CustomScreen',
        });
    });
  };

  // Refresh after One-Time Payment is made
  const loadPurchaseStatus = async () => {
    const appleAccessToken = await loadAppleAccessTokenFromStorage().catch(
      (error: any) => {
        console.log('loadAppleAccessTokenFromStorage Error: ', error);
      },
    );

    await loadVerifyPaymentFromStorage()
      .then(verifyPayment => {
        console.log(
          appleAccessToken?.access_token === null,
          verifyPayment?.one_time,
          appleAccessToken?.access_token === null && verifyPayment?.one_time,
        );
        console.log(
          'noope: ',
          appleAccessToken?.access_token,
          verifyPayment?.one_time,
        );

        // Store
        if (
          appleAccessToken?.access_token === undefined &&
          verifyPayment?.one_time
        ) {
          setLoading(true);
          const intervalId = setInterval(async () => {
            // Local
            if (accessToken.length === 0) {
              await loadAppleAccessTokenFromStorage()
                .then(appleAccessToken => {
                  if (appleAccessToken?.access_token) {
                    setAccessToken(appleAccessToken?.access_token);
                    setLoading(false);
                    refresh();
                    // To stop the interval, use clearInterval with the interval ID
                    clearInterval(intervalId);
                  }
                  console.log('This code runs every 1 second.');
                })
                .catch((error: any) => {
                  console.log('loadAppleAccessTokenFromStorage Error: ', error);
                });
            } else {
              // To stop the interval, use clearInterval with the interval ID
              clearInterval(intervalId);
            }
          }, 1000);
        } else if (appleAccessToken?.galleryRefresh) {
          storeAppleAccessToken({
            access_token: appleAccessToken?.access_token,
            galleryRefresh: false,
            individualRefresh: false,
          });
          setAccessToken(appleAccessToken?.access_token);
          refresh();
        } else {
          setAccessToken(appleAccessToken?.access_token);
        }
      })
      .catch((error: any) => {
        console.log('loadVerifyPaymentFromStorage Error: ', error);
      });
  };

  useFocusEffect(
    useCallback(() => {
      loadPurchaseStatus();
    }, []),
  );

  return (
    <>
      {showScreen ? (
        <SafeAreaView style={{flex: 1, backgroundColor: '#25282D'}}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={10}>
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#000000',
                padding: RFValue(15),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '48%',
                  justifyContent: 'flex-start',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#3386FF',
                    borderRadius: RFValue(20),
                    paddingVertical: RFValue(5),
                    paddingHorizontal: RFValue(10),
                    marginRight: RFValue(20),
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lucita-Regular',
                      color: 'white',
                      fontSize: RFValue(8),
                      alignSelf: 'center',
                      marginTop: RFValue(2),
                    }}>
                    CUSTOM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('BannerScreen')}
                  style={{
                    backgroundColor: '#A8A9AB',
                    borderRadius: RFValue(20),
                    paddingVertical: RFValue(5),
                    paddingHorizontal: RFValue(10),
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lucita-Regular',
                      color: 'white',
                      fontSize: RFValue(8),
                      alignSelf: 'center',
                      marginTop: RFValue(2),
                    }}>
                    BANNER
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '30%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SubscriptionScreen', {
                      returnScreen: 'CustomScreen',
                    });
                  }}>
                  <Pro width={RFValue(25)} height={RFValue(25)} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Navigation Menu */}
            <View style={{backgroundColor: '#FF439E', padding: RFValue(10)}}>
              {visibleSearch ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: '80%',
                      borderRadius: RFValue(30),
                      backgroundColor: '#FF439E',
                      borderWidth: 1,
                      borderColor: '#ffffff',
                      height: RFValue(35.5),
                    }}>
                    <Search
                      width={RFValue(20)}
                      height={RFValue(20)}
                      style={{marginHorizontal: RFValue(10)}}
                    />
                    <TextInput
                      editable={true}
                      placeholderTextColor={'#ffffff'}
                      placeholder={'Search'}
                      returnKeyType={'search'}
                      onSubmitEditing={e => {
                        setLoader(true);
                        setTag(e?.nativeEvent?.text);
                        Keyboard.dismiss();
                      }}
                      style={{
                        fontSize: RFValue(15),
                        fontFamily: 'arial',
                        width: '85%',
                        alignSelf: 'center',
                        height: RFValue(40),
                        color: '#ffffff',
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setTag('');
                      setVisibleSearch(false);
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Lucita-Regular',
                        color: '#ffffff',
                        fontSize: RFValue(14),
                        paddingLeft: RFValue(10),
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => setVisibleSearch(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: '#ffffff',
                      width: RFValue(35),
                      height: RFValue(35),
                      padding: RFValue(6),
                      borderRadius: RFValue(20),
                      marginRight: RFValue(10),
                    }}>
                    <Search width={RFValue(20)} height={RFValue(20)} />
                  </TouchableOpacity>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#FF439E',
                    }}>
                    {[
                      'Random',
                      'Angry',
                      'Happy',
                      'Hi',
                      'Mocking',
                      'Nervous',
                      'Nope',
                      'Reveal',
                      'Sad',
                      'Screen',
                      'Signs',
                      'Sports',
                      'Clothes',
                    ].map((data: string, index: number) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            if (data == tag) {
                              setTag('');
                            } else {
                              setTag(data);
                              setRefreshLoader(true);
                              setLoader(true);
                            }
                          }}
                          key={index}
                          style={[
                            {
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: RFValue(80),
                              height: RFValue(35),
                              borderRadius: RFValue(20),
                              marginRight: RFValue(15),
                              borderWidth: 1,
                            },
                            tag == data
                              ? {
                                  backgroundColor: '#F9C623',
                                  borderColor: '#F9C623',
                                }
                              : {
                                  backgroundColor: '#FF439E',
                                  borderColor: '#ffffff',
                                },
                          ]}>
                          <Text
                            style={[
                              tag == data
                                ? {color: '#24282C'}
                                : {color: '#ffffff'},
                              {
                                fontSize: RFValue(11),
                                paddingTop: RFValue(8),
                                paddingBottom: RFValue(5),
                                fontFamily: 'Lucita-Regular',
                              },
                            ]}>
                            {data}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Grid View */}
            <>
              <AppFlatlist
                data={allGif}
                API={getCustomTemplates}
                API2={getCustomRenders}
                refresh={refresh}
                isLoader={loader}
                setLoader={setLoader}
                refreshLoader={refreshLoader}
                UIDsLength={UIDs?.length}
                allGifLength={allGif?.length}
                tag={tag}
                text={renderInput?.current?.value}
                page={page}
                setPage={setPage}
                setLimit={setLimit}
                navigation={navigation}
              />
              {(UIDs?.length !== allGif?.length && refreshLoader) ||
                (getCustomRenders.isLoading && (
                  <View
                    style={[
                      {
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        backgroundColor: '#353535',
                        position: 'absolute',
                      },
                      (getCustomRenders.isLoading ||
                        UIDs?.length !== allGif?.length) &&
                      page !== 1
                        ? {bottom: 150}
                        : {top: 140},
                    ]}>
                    <ActivityIndicator
                      size={'large'}
                      color={'#FF439E'}
                      style={{paddingLeft: 2}}
                    />
                  </View>
                ))}
            </>

            {/* Text Ipnut */}
            <View
              style={{
                marginTop: RFValue(5),
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                width: '90%',
                borderRadius: RFValue(30),
                backgroundColor: '#ffffff',
                height: RFValue(40),
              }}>
              <TextInput
                editable={true}
                ref={renderInput}
                multiline={true}
                numberOfLines={2}
                placeholderTextColor={'#8d8d8d'}
                onChangeText={(e: any) => {
                  renderInput.current.value = e;
                }}
                placeholder={'Type your text here'}
                returnKeyType="next"
                style={{
                  width: '77%',
                  fontSize: RFValue(15),
                  fontFamily: 'arial',
                  paddingBottom: RFValue(2),
                  marginLeft: RFValue(20),
                  color: '#000000',
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  prevTag.current = tag;
                  setAllGIF([]);
                  setRefreshLoader(true);
                  renderRequestChunk();
                }}
                style={{width: '25%'}}>
                <View style={{padding: RFValue(10), alignSelf: 'flex-start'}}>
                  {loader ? (
                    <ActivityIndicator size={'small'} color={'#8d8d8d'} />
                  ) : (
                    <RightTick width={RFValue(20)} height={RFValue(20)} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

          {/* Payment Status Modal */}
          <AppPaymentStatusModal loading={loading} />
        </SafeAreaView>
      ) : (
        <Animated.View
          collapsable={false}
          style={[
            {
              flex: 1,
              backgroundColor: '#3386FF',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: containerOpacity,
            },
          ]}>
          <Animated.Image
            source={require('../assets/pngs/AppLogo.png')}
            style={[
              {
                width: 250,
                height: 250,
                opacity: imageOpacity,
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      )}
    </>
  );
};

export default CustomScreen;
