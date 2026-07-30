import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCoins } from '@fortawesome/free-solid-svg-icons';

const ForecastForm = ({ ticker, setTicker, daysToPredict, setDaysToPredict, onSubmit, loading }) => {
    return (
        <div className="bg-light-dark p-4 rounded h-100 shadow-sm">
            <h4 className="mb-4">
                <FontAwesomeIcon icon={faCoins} className="text-info me-2" />
                Forecast Config
            </h4>
            
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label className="form-label text-secondary small">Stock Symbol</label>
                    <select 
                        className="form-select bg-dark text-light border-secondary shadow-none"
                        value={ticker} 
                        onChange={(e) => setTicker(e.target.value)}
                    >
                        <option value="AAPL">Apple Inc. (AAPL)</option>
                        <option value="TSLA">Tesla Motors (TSLA)</option>
                        <option value="NVDA">NVIDIA Corp. (NVDA)</option>
                        <option value="MSFT">Microsoft Corp. (MSFT)</option>
                        <option value="AMZN">Amazon.com Inc. (AMZN)</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="form-label text-secondary small">Timeline Target (Days)</label>
                    <input 
                        type="number" 
                        className="form-control bg-dark text-light border-secondary shadow-none"
                        min="1" 
                        max="30"
                        value={daysToPredict}
                        onChange={(e) => setDaysToPredict(e.target.value)}
                        required
                    />
                    <div className="form-text text-light">Supports projections from 1 to 30 days out.</div>
                </div>

                {loading ? (
                    <button type="button" className="btn btn-info w-100 py-2" disabled>
                        <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                        Parsing Historical Sets...
                    </button>
                ) : (
                    <button type="submit" className="btn btn-info w-100 py-2 fw-bold text-dark">
                        Execute Prediction Engine
                    </button>
                )}
            </form>
        </div>
    );
};

export default ForecastForm;
