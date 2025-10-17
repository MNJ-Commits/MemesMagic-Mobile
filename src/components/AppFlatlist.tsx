import React from 'react';
import {RefreshControl, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import RenderItems from './RenderItem';
import {MasonryFlashList} from '@shopify/flash-list';

const LIMIT = 25;
const AppFlatlist = ({
  data,
  API,
  API2,
  giphy = false,
  refresh,
  isLoader,
  setLoader,
  allGifLength,
  page,
  setPage,
  tag,
  navigation,
  text,
  textPosition,
  textBackground,
  textStroke,
  color,
  font,
  appleAccessToken,
}: any) => {
  return (
    <MasonryFlashList
      data={data}
      numColumns={2}
      contentContainerStyle={{paddingTop: 20}}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode={'on-drag'}
      removeClippedSubviews={true}
      estimatedItemSize={150}
      refreshControl={
        <RefreshControl
          refreshing={API?.isFetching || API2?.isLoading}
          onRefresh={refresh}
          // enabled={API?.isFetching || API2?.isLoading}
          tintColor={'transparent'}
          colors={['#FF439E']}
          progressBackgroundColor={'#3386FF'}
        />
      }
      ListEmptyComponent={
        API?.isFetching || API2?.isLoading ? ( // Loading
          <Text
            style={{
              color: '#ffffff',
              fontFamily: 'Lucita-Regular',
              fontSize: RFValue(12),
              paddingBottom: RFValue(5),
              alignSelf: 'center',
              marginTop: RFValue(70),
            }}>
            {' '}
            Loading...{' '}
          </Text>
        ) : API?.data?.length !== 0 ? (
          <Text></Text>
        ) : (
          // No gif found
          <Text
            style={{
              color: '#ffffff',
              fontFamily: 'Lucita-Regular',
              fontSize: RFValue(12),
              paddingBottom: RFValue(5),
              alignSelf: 'center',
              marginTop: RFValue(50),
            }}>
            No content found
          </Text>
        )
      }
      onEndReachedThreshold={0.1}
      onEndReached={() => {
        API?.data?.length === LIMIT &&
        data.length / 25 === page &&
        (tag || giphy) &&
        page <= 3
          ? setPage(page + 1)
          : API?.data?.length <= LIMIT && giphy && page <= 3
          ? setPage(page + 1)
          : API?.data?.length === LIMIT &&
            data.length / 25 === page &&
            !tag &&
            !giphy
          ? setPage(page + 1)
          : null;
      }}
      ListFooterComponent={
        API?.isFetching && allGifLength === 0 ? (
          <Text></Text>
        ) : (API?.data?.length <= LIMIT && giphy && page <= 3) ||
          (!API.isLoading &&
            API?.data?.length === LIMIT &&
            !API2?.isLoading &&
            page <= 3 &&
            tag) ? (
          <Text
            style={{
              fontFamily: 'Lucita-Regular',
              color: 'white',
              fontSize: 14,
              alignSelf: 'center',
              paddingTop: 10,
              paddingBottom: 30,
            }}>
            Load More
          </Text>
        ) : API?.data?.length == LIMIT && !API2?.isLoading && !tag && !giphy ? (
          <Text
            style={{
              fontFamily: 'Lucita-Regular',
              color: 'white',
              fontSize: 14,
              alignSelf: 'center',
              paddingTop: 10,
              paddingBottom: 30,
            }}>
            Load More
          </Text>
        ) : (
          <Text></Text>
        )
      }
      extraData={[
        giphy,
        text,
        textPosition,
        textBackground,
        textStroke,
        color,
        font,
        isLoader,
        setLoader,
        appleAccessToken,
      ]}
      renderItem={({item, extraData}) => (
        <RenderItems
          extraData={extraData}
          item={item}
          giphy={giphy}
          text={text}
          textPosition={textPosition}
          textBackground={textBackground}
          textStroke={textStroke}
          color={color}
          font={font}
          navigation={navigation}
          setLoader={setLoader}
          loader={isLoader}
          appleAccessToken={appleAccessToken}
        />
      )}
    />
  );
};

export default AppFlatlist;
