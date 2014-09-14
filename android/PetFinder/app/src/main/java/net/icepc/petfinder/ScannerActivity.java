package net.icepc.petfinder;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class ScannerActivity extends Activity implements View.OnClickListener{
    public Button btn1, btn2;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.scanner_layout);
        btn1 = (Button) findViewById(R.id.scanner_button_main);
        btn2 = (Button) findViewById(R.id.scanner_button_map);

        btn1.setOnClickListener(this);
        btn2.setOnClickListener(this);
    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.scanner_button_main:
                Intent intent = new Intent(this, MainActivity.class);
                startActivity(intent);
                break;
            case R.id.scanner_button_map:
                Intent intent2 = new Intent(this, MapActivity.class);
                startActivity(intent2);
                break;
        }
    }
}
