function showRegistration()
{
    document.getElementById("verifyPassword").style.display = 'block';
    document.getElementById("buttonRegister").style.display = 'block';
    document.getElementById("backLogin").style.display = 'block';
    
    document.getElementById("buttonLogin").style.display = 'none';
    document.getElementById("buttonNewUser").style.display = 'none';
    document.getElementById("buttonForgotPassword").style.display = 'none';
    document.getElementById("backMain").style.display = 'none';

}


function showDefault()
{
    document.getElementById("buttonLogin").style.display = 'block';
    document.getElementById("buttonNewUser").style.display = 'block';
    document.getElementById("buttonForgotPassword").style.display = 'block';
    document.getElementById("backMain").style.display = 'block';

    document.getElementById("verifyPassword").style.display = 'none';
    document.getElementById("buttonRegister").style.display = 'none';
    document.getElementById("backLogin").style.display = 'none';
}
