'use client';

import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Country, City } from 'country-state-city';
import dynamic from 'next/dynamic';
import { SignProtocolClient, SpMode, EvmChains } from '@ethsign/sp-sdk';
import { useAttestations } from './hooks/useAttestations';

const MapComponent = dynamic(() => import('./components/Map'), { ssr: false });

interface Location {
  country: string;
  city: string;
  lat: number;
  lng: number;
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);

  const { attestations, loading, error } = useAttestations(
    "onchain_evm_8453_0x9bed"
  );

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const countryCities = City.getCitiesOfCountry(countryCode) || [];
    setCities(countryCities);
    setSelectedCity('');
  };

  const handleSubmit = async () => {
    if (!isConnected || !selectedCountry || !selectedCity) return;
    
    setIsSubmitting(true);
    try {
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.base,
      });

      await client.createAttestation({
        schemaId: "0x9bed",
        data: { 
          Country: selectedCountry,
          City: [selectedCity]
        },
        indexingValue: `${selectedCountry}-${selectedCity}`,
      });

      alert('Location successfully attested!');
    } catch (error) {
      console.error('Error submitting attestation:', error);
      alert('Failed to submit attestation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理 attestations 并获取位置信息
  useEffect(() => {
    if (attestations.length > 0) {
      const newLocations: Location[] = [];
      
      attestations.forEach(attestation => {
        const countryCode = attestation.data.Country;
        const cityName = attestation.data.City[0];
        
        // 获取国家信息
        const country = Country.getCountryByCode(countryCode);
        if (!country) return;

        // 获取城市信息
        const allCities = City.getCitiesOfCountry(countryCode) || [];
        const city = allCities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
        
        if (city && city.latitude && city.longitude) {
          newLocations.push({
            country: country.name,
            city: cityName,
            lat: parseFloat(city.latitude),
            lng: parseFloat(city.longitude)
          });
        } else {
          console.warn(`No coordinates found for city: ${cityName}`);
        }
      });

      console.log('Processed locations:', newLocations);
      setLocations(newLocations);
    }
  }, [attestations]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Seeing Signs</h1>
            </div>
            <div className="flex items-center gap-4">
              {isConnected ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      {formatAddress(address || '')}
                    </span>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <w3m-button />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600">Mark your presence on the global map</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧表单 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              {!isConnected ? (
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
                  <p className="text-gray-600 mb-4">Please connect your wallet to add your location</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Add Your Location</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={selectedCountry}
                      onChange={(e) => handleCountryChange(e.target.value)}
                    >
                      <option value="">Select a country</option>
                      {Country.getAllCountries().map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedCountry}
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={handleSubmit}
                    disabled={!selectedCountry || !selectedCity || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Location'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 右侧地图 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
              <MapComponent locations={locations} />
            </div>

            {/* Attestations 列表 */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Recent Attestations</h2>
              {loading ? (
                <div className="text-center py-4">Loading attestations...</div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">Error: {error}</div>
              ) : (
                <div className="grid gap-4">
                  {attestations.map((attestation, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4">
                      <div className="space-y-2">
                        <div className="font-medium">
                          Location: {Country.getCountryByCode(attestation.data.Country)?.name}, {attestation.data.City[0]}
                        </div>
                        <div className="text-sm text-gray-500">
                          Attester: {attestation.attester}
                        </div>
                        <div className="text-sm text-gray-500">
                          Time: {new Date(attestation.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
