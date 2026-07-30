import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import ForecastForm from './ForecastForm';
import PredictionChart from './PredictionChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    // Structural Global Authentication Security Verification States
    const [protectedData, setProtectedData] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState('');

    // Centralised Form Parameters used to drive the components via Props
    const [ticker, setTicker] = useState('AAPL');
    const [daysToPredict, setDaysToPredict] = useState(7);
    const [predictionResult, setPredictionResult] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Run security checkpoint verification on mounting
    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await axiosInstance.get('/protected-view');
                setProtectedData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setPageError('Failed to load secure metrics. Your login session might have expired.');
            } finally {
                setPageLoading(false);
            }
        };
        fetchProtectedData();
    }, []);

    // Dispatch form actions down to the backend Django API service
    const handlePredict = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setPredictionResult(null);

        try {
            const response = await axiosInstance.post('/predict/', {
                stock_ticker: ticker,
                days: parseInt(daysToPredict)
            });
            setPredictionResult(response.data.prediction);
        } catch (error) {
            console.error('Prediction network request error:', error.response?.data);
            alert('Could not sync data connections with Django ML Engine.');
        } finally {
            setFormLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="container text-center text-light mt-5 p-5">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-info mb-3" />
                <h3>Decrypting Portal Vault...</h3>
            </div>
        );
    }

    if (pageError) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center shadow p-4">
                    <h4>🔒 Access Denied</h4>
                    <p>{pageError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="text-light container mt-4">
            {/* Header Status Navigation Card */}
            <div className="row mb-4">
                <div className="col bg-light-dark p-4 rounded shadow-sm">
                    <h2>Market Intelligence Station</h2>
                    <p className="text-info mb-0">
                        Backend Status: {protectedData?.status || "Connected to Secure Model Cache"}
                    </p>
                </div>
            </div>

            {/* Split Panel Architecture Grid */}
            <div className="row g-4">
                <div className="col-md-5">
                    <ForecastForm 
                        ticker={ticker}
                        setTicker={setTicker}
                        daysToPredict={daysToPredict}
                        setDaysToPredict={setDaysToPredict}
                        onSubmit={handlePredict}
                        loading={formLoading}
                    />
                </div>

                <div className="col-md-7">
                    <PredictionChart result={predictionResult} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
