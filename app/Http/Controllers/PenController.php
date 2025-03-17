<?php

namespace App\Http\Controllers; //コントローラーの名前空間

use Illuminate\Http\Request; //Requestをuseする
use App\Models\Pen; //Penモデルをuseする
use App\Http\Requests\PenStoreRequest; //PenStoreRequestをuseする

class PenController extends Controller
{
  // 一覧表示
  //penの全データを取得して、json形式で返す
  public function index()
  {
    // $pens = Pen::all(); //penモデルの全データを取得
    $pens = Pen::paginate(4); //ページネーション
    return response()->json([ //json形式で返す
      'data' => $pens //dataに$pensを代入
    ], 200); //ステータスコード200
  }

  // 登録
  //新しいpenのインスタンスを作成し、リクエストのnameとpriceを代入して保存
  public function store(PenStoreRequest $request) //リクエストを受け取る
  {
    $pen = new Pen(); //新しいpenのインスタンスを作成
    $pen->name = $request->name; //リクエストのnameを代入
    $pen->price = $request->price; //リクエストのpriceを代入
    $pen->save(); //保存
    return response()->json([ //json形式で返す
      'data' => $pen //dataに$penを代入
    ], 201); //ステータスコード201
  }

  // 指定のデータのみ取得
  //idを受け取り、そのidのデータを取得してjson形式で返す
  public function edit($id) //idを受け取る
  {
    $pen = Pen::find($id); //idのデータを取得
    return response()->json([ //json形式で返す
      'data' => $pen //dataに$penを代入
    ], 200); //ステータスコード200
  }

  // 指定のデータを更新
  //リクエストとpenを受け取り、penにリクエストのデータを代入して保存
  public function update(PenStoreRequest $request, Pen $pen) //リクエストとpenを受け取る
  {
    $pen->fill($request->all()); //リクエストのデータを$penに代入
    $pen->save(); //保存
    return response()->json([ //json形式で返す
      'data' => $pen //dataに$penを代入
    ], 200); //ステータスコード200
  }

  // 指定のデータを削除
  //penを受け取り、削除
  public function delete(Pen $pen) //penを受け取る
  {
    $pen->delete(); //削除
    return response()->json([ //json形式で返す
      'message' => '無事に削除しました' //messageに'無事に削除しました'を代入
    ], 200); //ステータスコード200
  }
}
