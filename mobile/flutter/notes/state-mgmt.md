# State Management

## State Management for a Shopping app

- Wrap the common ancestor inside a `ChangeNotifierProvider` object. Assign the parameter `create`.

```dash
ChangeNotifierProvider() {
  create: () => Cart()
  child: HomeScreen(
    /// ...
  ),
}
```

- Create the notifier class. Give it some `notifyListeners()` calls.

```dash
class Cart extends ChangeNotifier {

}
```

- For consumers: use `Consumer<Type>` or `Provider.of`.
