# refresh_models.py
import os
import yfinance as yf
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

# Setup absolute file positioning metrics directly to current folder context
MODELS_DIR = os.path.dirname(os.path.abspath(__file__))

# Define full active multi-ticker registry array
tickers = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN"]

print("⚡ Starting automated cron pipeline execution from ml_models folder...")

for current_ticker in tickers:
    try:
        print(f"📥 Refreshing yfinance data vectors for: {current_ticker}")
        
        # Download recent history to provide contextual training sample balance
        df = yf.download(current_ticker, start="2020-01-01")
        if df.empty:
            continue
            
        # 🌟 FIX: Cleanly extract the Close column and force it into a 1D numeric Series
        if isinstance(df.columns, pd.MultiIndex):
            close_series = df['Close'][current_ticker].squeeze()
        else:
            close_series = df['Close'].squeeze()
            
        # Convert series data explicitly into floats to break up multi-index tracking wrappers
        close_prices = pd.to_numeric(close_series, errors='coerce').astype(float)
        
        # Rebuild a clean, flat processing DataFrame layout
        clean_df = pd.DataFrame({'Close': close_prices}, index=df.index)
        
        # Feature Engineering Pipeline
        clean_df['SMA_20'] = clean_df['Close'].rolling(window=20).mean()
        delta = clean_df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        clean_df['RSI_14'] = 100 - (100 / (1 + rs))
        clean_df = clean_df.dropna()
        
        feature_cols = ['Close', 'SMA_20', 'RSI_14']
        feature_data = clean_df[feature_cols].values
        
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_features = scaler.fit_transform(feature_data)
        
        prediction_days = 30
        X_lstm, y_lstm = [], []
        for x in range(prediction_days, len(scaled_features)):
            X_lstm.append(scaled_features[x-prediction_days:x, :])
            y_lstm.append(scaled_features[x, 0])
            
        X_lstm, y_lstm = np.array(X_lstm), np.array(y_lstm)
        
        # Fixed dimension targeting syntax structure explicitly
        X_lstm = np.reshape(X_lstm, (X_lstm.shape[0], X_lstm.shape[1], 3))
        
        # Build neural layers sequence architecture
        model = Sequential([
            LSTM(units=50, return_sequences=True, input_shape=(X_lstm.shape[1], 3)),
            Dropout(0.2),
            LSTM(units=50, return_sequences=False),
            Dropout(0.2),
            Dense(units=25),
            Dense(units=1)
        ])
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        model.fit(X_lstm, y_lstm, epochs=5, batch_size=32, verbose=0)
        
        # Pack operational tracking variables into the dictionary payload
        model_data = {
            'model_architecture': model.to_json(),
            'model_weights': model.get_weights(),
            'scaler': scaler,
            'last_30_days_scaled': scaled_features[-30:],
            'last_price': float(clean_df['Close'].iloc[-1])
        }
        
        # Overwrite the existing operational file completely to refresh metrics
        filename = os.path.join(MODELS_DIR, f"{current_ticker}_lstm_model.pkl")
        joblib.dump(model_data, filename)
        print(f"✅ Refreshed asset metrics output: {filename}")
        
    except Exception as e:
        print(f"❌ Failed to process automated updates for {current_ticker}: {e}")

print("🎉 Nightly automation sequence successfully completed!")
