import os
from django.apps import AppConfig
import joblib
from tensorflow.keras.models import model_from_json

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = "accounts"

    
    loaded_lstm_models = {}
    loaded_models = {} 

    def ready(self):
        
        if os.environ.get('RUN_MAIN') != 'true':
            return 

        
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        ml_folder = os.path.join(BASE_DIR, 'ml_models') 
        
        target_tickers = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN"]
        
        print("\n" + "="*50)
        print("Initializing deep learning LSTM engine framework...")
        
        for ticker in target_tickers:
            model_path = os.path.join(ml_folder, f"{ticker}_lstm_model.pkl")
            
            if os.path.exists(model_path):
                try:
                    raw_pack = joblib.load(model_path)
                    
                    model = model_from_json(raw_pack['model_architecture'])
                    model.set_weights(raw_pack['model_weights'])
                    
                    AccountsConfig.loaded_lstm_models[ticker] = {
                        'model': model,
                        'scaler': raw_pack['scaler'],
                        'last_30_days_scaled': raw_pack['last_30_days_scaled'],
                        'last_price': raw_pack['last_price']
                    }
                    print(f"Loaded Neural Memory: {ticker} LSTM tracking operational.")
                except Exception as e:
                    print(f"Failed deserializing neural matrix for {ticker}: {e}")
            else:
                print(f"Model artifact missing: {ticker} not found at {model_path}")
                
        print("="*50 + "\n")
