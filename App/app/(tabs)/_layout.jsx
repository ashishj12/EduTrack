import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} >
      <Tabs.Screen 
        name="dashboard" 
        options={{
          title: 'dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard-edit" size={size} color={color} />
          ),
        }
    } 
      />
      <Tabs.Screen 
        name="Records" 
        options={{
          title: 'Records',
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="Reports" 
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="report-problem" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="Settings" 
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}