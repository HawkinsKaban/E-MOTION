import AsyncStorage from '@react-native-async-storage/async-storage';

// Fungsi untuk logout - dibuat sangat sederhana dan langsung
export const logout = async () => {
  try {
    // Hapus token dan username (pendekatan sederhana)
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('username');
    
    // Coba hapus data lain yang mungkin terkait
    try {
      await AsyncStorage.removeItem('userSettings');
      // Opsi: hapus history jika diperlukan
      // await AsyncStorage.removeItem('analysisHistory');
    } catch (e) {
      // Abaikan error sekunder, yang penting token dihapus
      console.log('Warning: Sebagian data tidak terhapus', e);
    }
    
    console.log('Logout berhasil, token dan username dihapus');
    return true;
  } catch (error) {
    console.error('Error saat logout:', error);
    return false;
  }
};

// Fungsi untuk memeriksa status login - dibuat sederhana
export const isLoggedIn = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return !!token; // Konversi ke boolean
  } catch (error) {
    console.error('Error checking login:', error);
    return false;
  }
};