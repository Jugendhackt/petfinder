package net.icepc.petfinder;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;


public class MainActivity extends Activity implements View.OnClickListener{
    public Button btn1;
    public Button btn2;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_layout);
        btn1 = (Button) findViewById(R.id.main_button_map);
        btn2 = (Button) findViewById(R.id.main_button_scanner);
        btn1.setOnClickListener(this);
        btn2.setOnClickListener(this);
    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.main_button_map:
                Intent intent = new Intent(this, MapActivity.class);
                startActivity(intent);
                break;
            case R.id.main_button_scanner:
                Intent intent2 = new Intent(this, ScannerActivity.class);
                startActivity(intent2);
                break;
        }
    }
}
