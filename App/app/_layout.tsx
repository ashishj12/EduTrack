import { Stack } from "expo-router";
import "./global.css";

export default function Layout() {
 return (
   <Stack
     screenOptions={{
       headerStyle: {
         backgroundColor: '#f4f4f4',
       },
       headerTintColor: '#000',
       headerTitle: "Smart Attendance", // Set custom header title
       headerShown: false
     }}
   >
     <Stack.Screen
       name="index"
       options={{
         headerShown: false
       }}
     />
     <Stack.Screen
       name="Login"
       options={{
         headerShown: true,
         headerTitle: "Login" // Specific title for Login screen
       }}
     />
   </Stack>
 );
}