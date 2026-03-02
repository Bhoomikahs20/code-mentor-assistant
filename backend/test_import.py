import traceback
try:
    from app.main import app
    print('IMPORT OK')
except Exception as e:
    traceback.print_exc()
