import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { useWindowDimensions, TouchableOpacity, Text, StyleSheet } from 'react-native';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { Colors } from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import NewsArticleScreen from '../screens/newsarticle/NewsArticleScreen';
import TagScreen from '../screens/tag/TagScreen';
import CategoriesScreen from '../screens/category/CategoryScreen';
import ReadingListScreen from '../screens/readinglist/ReadingListScreen';

export type DrawerParamList = {
  Home: undefined;
  NewsArticle: undefined;
  Tag: undefined;
  Categories: undefined;
  ReadingList: undefined;
  Login: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  const { userInfo } = useAuth();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerType: 'permanent',
        drawerActiveTintColor: Colors.primary,
        drawerLabelStyle: { marginLeft: 0, fontSize: 16 },
        drawerStyle: { backgroundColor: Colors.white, width: 250 },
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        overlayColor: 'transparent',
        headerLeft: () => (
          <></>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={styles.headerRightContainer}
          >
            <Ionicons
              name={userInfo ? 'person-circle-outline' : 'log-in-outline'}
              size={30}
              color={Colors.white}
            />
            {userInfo && <Text style={styles.userName}>{userInfo.username}</Text>}
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          title: 'Feed',
        }}
      />
      <Drawer.Screen
        name="NewsArticle"
        component={NewsArticleScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="newspaper-outline" size={size} color={color} />,
          title: 'Meus Artigos',
        }}
      />
      <Drawer.Screen
        name="Tag"
        component={TagScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="pricetag-outline" size={size} color={color} />,
          title: 'Tags',
        }}
      />
      <Drawer.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          title: 'Categorias',
        }}
      />
      <Drawer.Screen
        name="ReadingList"
        component={ReadingListScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
          title: 'Listas de Leitura',
        }}
      />
      <Drawer.Screen
        name="Login"
        component={LoginScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Login',
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  userName: {
    color: Colors.white,
    marginLeft: 5,
    fontSize: 16,
  },
});

export default DrawerNavigator;