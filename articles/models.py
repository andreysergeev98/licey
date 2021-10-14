from django.db import models

class Reporter(models.Model):
    full_name = models.CharField(max_length=70)

    def __str__(self):
        return self.full_name

class Article(models.Model):
    pub_date = models.DateField()
    headline = models.CharField(max_length=200)
    content = models.TextField()
    reporter = models.CharField(max_length=200)

    def __str__(self):
        return self.headline

class Story(models.Model):
    pub_date = models.DateField()
    headline = models.CharField(max_length=200)
    banner = models.ImageField(upload_to='images/')
    stories = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.headline



class BigDiscount(models.Model):
    pub_date = models.DateField()
    headline = models.CharField(max_length=200)
    banner = models.ImageField(upload_to='images/')
    content = models.TextField()

    def __str__(self):
        return self.headline


class CrazySale(models.Model):
    pub_date = models.DateField()
    last_date = models.DateField()
    banner = models.ImageField(upload_to='images/')
    headline = models.CharField(max_length=200)
    discount = models.CharField(max_length=200)
    content = models.TextField()
    placeholder = models.TextField()

    def __str__(self):
        return self.headline

class Category(models.Model):
    pub_date = models.DateField()
    banner = models.ImageField(upload_to='images/')
    headline = models.CharField(max_length=200)
    conter = models.CharField(max_length=200)

    def __str__(self):
        return self.headline



class Likedapp(models.Model):

    theme = models.CharField(max_length=200)
    content = models.TextField()

    def __str__(self):
        return self.theme