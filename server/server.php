<?php
        session_start();
       if($_SESSION['username']!=null){

       }else{
       	    $mongo = new Mongo("mongodb://trung:123456@paulo.mongohq.com:10040/quac"); // Connect to Mongo Server
       		$db = $mongo->selectDB('quac');
       		$collection = $db->selectCollection('user');
            if(isset($_POST['username'])&&isset($_POST['password'])){
                        if($_POST['do']=="login"){
                            $info = $collection->find(array('username'=>$_POST['username']))->limit(1);
                            $users = iterator_to_array($info);
                            if(empty($users)){
                                $doc= array('username'=>$_POST['username'],'password'=>$_POST['password'],'status'=>0);
                                $collection->insert($doc);
                                $_SESSION['username']=$_POST['username'];
                                echo "success";
                            }else{
                                echo "Tài khoản đã tồn tại !";
                            }
                        }else if($_POST['do']=="singin"){
                            $info = $collection->find(array('username'=>$_POST['username'],array('password'=>$_POST['password']))->limit(1);
                            $users = iterator_to_array($info);
                            if(empty($users)){
                                echo "Tài khoản hoặc mật khẩu không đúng"
                            }else{
                                echo "success";
                                $_SESSION['username']=$_POST['username'];
                            }
                        }

                    }
       }
