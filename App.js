import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

export default function App() {
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const currencies = [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'JPY', value: 'JPY' },
    { label: 'GBP', value: 'GBP' },
    { label: 'AUD', value: 'AUD' },
    { label: 'CAD', value: 'CAD' },
  ];

  const handleConvert = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid positive amount');
      return;
    }

    try {
      const response = await axios.get(
        `https://api.exchangeratesapi.io/v1/latest?access_key=2904d03d1ac53068f80ee9a4ed5c96d1&base=${fromCurrency}&symbols=${toCurrency}`
      );
      const rate = response.data.rates[toCurrency];

      if (!rate) {
        Alert.alert('Error', 'Unable to fetch the conversion rate for the selected currencies.');
        return;
      }

      const result = (parseFloat(amount) * rate).toFixed(2);
      setConvertedAmount(result);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch conversion rate. Please check your internet connection or API key.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(value) => setAmount(value)}
      />

      <View style={styles.row}>
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => setFromCurrency(value)}
          items={currencies}
          value={fromCurrency}
          placeholder={{ label: 'From Currency', value: null }}
        />
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => setToCurrency(value)}
          items={currencies}
          value={toCurrency}
          placeholder={{ label: 'To Currency', value: null }}
        />
      </View>

      <Button title="Convert" onPress={handleConvert} color="#4CAF50" />

      {convertedAmount ? (
        <Text style={styles.result}>
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333333',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#f8f8f8',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#2c3e50',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: '#333',
    backgroundColor: '#f8f8f8',
    width: '45%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: '#333',
    backgroundColor: '#f8f8f8',
    width: '45%',
  },
});
